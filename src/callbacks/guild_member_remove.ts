/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildMember, PartialGuildMember, TextChannel, User } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberRemove", async (member) => {
            try {
                await this.process(global_context, member);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, member: GuildMember | PartialGuildMember) {
        if (global_context.bot.user === null) {
            return;
        }

        const moderation_action = global_context.data.last_moderation_actions.get(member.guild.id);
        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(member.guild.id, 0);
        if (guild_data === null) {
            return;
        }

        /* Process leave messages */
        if (guild_data.leave_messages === true && guild_data.leave_messages_channel !== null) {
            const format = guild_data.leave_messages_format.replace("<user>", `**${member.user.tag}**`);
            const channel = await global_context.bot.channels.fetch(guild_data.leave_messages_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel instanceof TextChannel) {
                channel.send(format).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        /* Process audit logging */
        if (guild_data.audit_kicks === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }
            const audits = await member.guild.fetchAuditLogs({ limit: 1 }).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (audits === null) {
                return;
            }
            const audit = audits.entries.first();
            if (audit === undefined || !(audit.target instanceof User) || audit.executor === null) {
                return;
            }

            if (audit.action === "MEMBER_KICK" && audit.target.id === member.user.id) {
                const executor = audit.executor.id === global_context.bot.user.id ? moderation_action.moderator : audit.executor.id;
                const url = audit.target.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedKick = {
                    author: {
                        name: `Kick | ${audit.target.tag}`,
                        icon_url: url === null ? undefined : url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: audit.target.tag,
                            inline: true,
                        },
                        {
                            name: "Moderator:",
                            value: `<@${executor}>`,
                            inline: true,
                        },
                        {
                            name: "Reason:",
                            value: audit.reason === null ? "None" : audit.reason,
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
