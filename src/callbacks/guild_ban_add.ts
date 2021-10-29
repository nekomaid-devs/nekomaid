import { GuildBan, TextChannel, User } from "discord.js";
import { GlobalContext } from "../ts/types";
import * as Sentry from "@sentry/node";

export default function hook(global_context: GlobalContext) {
    global_context.bot.on("guildBanAdd", async (ban) => {
        try {
            await process(global_context, ban);
        } catch (e) {
            if (global_context.config.sentry_enabled === true) {
                Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            } else {
                global_context.logger.error(e);
            }
        }

        global_context.data.total_events += 1;
        global_context.data.processed_events += 1;
    });
}

async function process(global_context: GlobalContext, ban: GuildBan) {
    if(global_context.bot.user === null) { return; }

    const moderation_action = global_context.data.last_moderation_actions.get(ban.guild.id);
    const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_ban_add", id: ban.guild.id });

    if (server_config.audit_bans == true && server_config.audit_channel !== "-1") {
        const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        if (!(channel instanceof TextChannel)) { return; }
        const audit = await ban.guild.fetchAuditLogs().catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if(audit === null) { return; }
        const last_audit = audit.entries.first();
        if(last_audit === undefined || !(last_audit.target instanceof User) || last_audit.executor === null) { return; }

        if (last_audit.action === "MEMBER_BAN_ADD" && last_audit.target.id === ban.user.id) {
            let executor;
            if (last_audit.executor.id === global_context.bot.user.id) {
                executor = await global_context.bot.users.fetch(moderation_action.moderationManager).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
            } else {
                executor = await global_context.bot.users.fetch(last_audit.executor.id).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
            }
            if(executor === null) { return; }

            const url = ban.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedBan: any = {
                author: {
                    name: `Case ${server_config.case_ID}# | Ban | ${ban.user.tag}`,
                    icon_url: url,
                },
                fields: [
                    {
                        name: "User:",
                        value: ban.user.tag,
                        inline: true,
                    },
                    {
                        name: "Moderator:",
                        value: executor.toString(),
                        inline: true,
                    },
                    {
                        name: "Reason:",
                        value: last_audit.reason === null ? "None" : last_audit.reason,
                    },
                    {
                        name: "Duration:",
                        value: moderation_action === undefined ? "Unknown" : moderation_action.duration,
                        inline: true,
                    },
                ],
            };

            server_config.case_ID += 1;
            global_context.neko_modules_clients.mySQL.edit(global_context, { type: "server_cb", server: server_config });

            channel.send({ embeds: [embedBan] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    }

    const server_ban = {
        id: global_context.modules.crypto.randomBytes(16).toString("hex"),
        server_ID: ban.guild.id,
        user_ID: ban.user.id,
        start: moderation_action !== undefined ? moderation_action.start : Date.now(),
        reason: moderation_action !== undefined ? moderation_action.reason : "None",
        end: moderation_action !== undefined ? moderation_action.end : -1,
    };
    global_context.neko_modules_clients.mySQL.mysql_add.add_server_ban(global_context, server_ban);
    global_context.data.last_moderation_actions.delete(ban.guild.id);
}
