/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildEditType, GuildFetchType } from "../scripts/db/db_utils";
import { GuildBan, TextChannel, User } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildBanRemove", async (ban) => {
            try {
                await this.process(global_context, ban);
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
    },

    async process(global_context: GlobalContext, ban: GuildBan) {
        if (global_context.bot.user === null) {
            return;
        }

        const moderation_action = global_context.data.last_moderation_actions.get(ban.guild.id);
        const server_config = await global_context.neko_modules_clients.db.fetch_server(ban.guild.id, GuildFetchType.AUDIT, false, false);
        if (server_config === null) {
            return;
        }
        const server_bans = await global_context.neko_modules_clients.db.fetch_server_bans(ban.guild.id);

        if (server_config.audit_bans === true && server_config.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
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

            if (last_audit.action === "MEMBER_BAN_REMOVE" && last_audit.target.id === ban.user.id) {
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
                if (executor === null) {
                    return;
                }

                const url = ban.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBan = {
                    author: {
                        name: `Case ${server_config.case_ID}# | Unban | ${ban.user.tag}`,
                        icon_url: url === null ? undefined : url
                    },
                    fields: [
                        {
                            name: "User:",
                            value: ban.user.tag,
                            inline: true
                        },
                        {
                            name: "Moderator:",
                            value: executor.toString(),
                            inline: true
                        },
                        {
                            name: "Reason:",
                            value: last_audit.reason === null ? "None" : last_audit.reason
                        }
                    ]
                };

                server_config.case_ID += 1;
                global_context.neko_modules_clients.db.edit_server(server_config, GuildEditType.AUDIT);

                channel.send({ embeds: [ embedBan ] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        const previous_ban = server_bans.find((ban: any) => {
            return ban.user_ID === ban.user.id;
        });
        if (previous_ban !== undefined) {
            global_context.neko_modules_clients.db.remove_server_ban(previous_ban.id);
        }
        global_context.data.last_moderation_actions.delete(ban.guild.id);
    }
} as Callback;
