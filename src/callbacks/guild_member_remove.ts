/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildMember, PartialGuildMember, TextChannel, User } from "discord.js";

/* Node Imports */
import * as Sentry from "@sentry/node";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberRemove", async (member) => {
            try {
                await this.process(global_context, member);
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

    async process(global_context: GlobalContext, member: GuildMember | PartialGuildMember) {
        if (member.user === null || global_context.bot.user === null) {
            return;
        }

        const moderation_action = global_context.data.last_moderation_actions.get(member.guild.id);
        const server_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "server_guild_member_remove", id: member.guild.id });

        if (server_config.leave_messages == true) {
            let format = server_config.leave_messages_format;
            const member_display_name = "**" + member.user.tag + "**";
            format = format.replace("<user>", member_display_name);

            const channel = await global_context.bot.channels.fetch(server_config.leave_messages_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof TextChannel)) {
                return;
            }
            channel.send(format).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }

        if (server_config.audit_kicks == true && server_config.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }
            const audit = await member.guild.fetchAuditLogs().catch((e: Error) => {
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

            if (last_audit.action === "MEMBER_KICK" && last_audit.target.id === member.user.id) {
                let executor;
                if (last_audit.executor.id === global_context.bot.user.id) {
                    executor = await member.guild.members.fetch(moderation_action.moderationManager).catch((e: Error) => {
                        global_context.logger.api_error(e);
                        return null;
                    });
                    global_context.data.last_moderation_actions.delete(member.guild.id);
                } else {
                    executor = await member.guild.members.fetch(last_audit.executor.id).catch((e: Error) => {
                        global_context.logger.api_error(e);
                        return null;
                    });
                }
                if (executor === null) {
                    return;
                }

                const embedKick: any = {
                    author: {
                        name: `Kick | ${last_audit.target.tag}`,
                        icon_url: last_audit.target.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                    },
                    fields: [
                        {
                            name: "User:",
                            value: last_audit.target.tag,
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
                    ],
                };

                channel.send({ embeds: [embedKick] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }
    },
} as Callback;
