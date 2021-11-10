/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildBan, TextChannel, User } from "discord.js-light";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildBanAdd", async (ban) => {
            try {
                await this.process(global_context, ban);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, ban: GuildBan) {
        if (global_context.bot.user === null) {
            return;
        }

        const moderation_action = global_context.data.last_moderation_actions.get(ban.guild.id);
        const guild_data = await global_context.neko_modules_clients.db.fetch_audit_guild(ban.guild.id, false, false);
        if (guild_data === null) {
            return;
        }

        if (guild_data.audit_bans === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }
            const audit = await ban.guild.fetchAuditLogs().catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (audit === null) {
                return;
            }
            const last_audit = audit.entries.first();
            if (last_audit === undefined || !(last_audit.target instanceof User) || last_audit.executor === null) {
                return;
            }

            if (last_audit.action === "MEMBER_BAN_ADD" && last_audit.target.id === ban.user.id) {
                let executor;
                if (last_audit.executor.id === global_context.bot.user.id) {
                    executor = await global_context.bot.users.fetch(moderation_action.moderator).catch((e: Error) => {
                        global_context.logger.api_error(e);
                        return null;
                    });
                } else {
                    executor = await global_context.bot.users.fetch(last_audit.executor.id).catch((e: Error) => {
                        global_context.logger.api_error(e);
                        return null;
                    });
                }
                if (executor === null) {
                    return;
                }

                const url = ban.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBan = {
                    author: {
                        name: `Case ${guild_data.case_ID}# | Ban | ${ban.user.tag}`,
                        icon_url: url === null ? undefined : url,
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

                guild_data.case_ID += 1;
                global_context.neko_modules_clients.db.edit_audit_guild(guild_data);

                channel.send({ embeds: [embedBan] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        const guild_ban = {
            id: randomBytes(16).toString("hex"),
            guild_ID: ban.guild.id,
            user_ID: ban.user.id,
            start: moderation_action !== undefined ? moderation_action.start : Date.now(),
            reason: moderation_action !== undefined ? moderation_action.reason : "None",
            end: moderation_action !== undefined ? moderation_action.end : -1,
        };
        global_context.neko_modules_clients.db.add_guild_ban(guild_ban);
        global_context.data.last_moderation_actions.delete(ban.guild.id);
    },
} as Callback;
