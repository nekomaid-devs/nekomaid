/* Types */
import { GlobalContext, Callback, AuditGuildData, GuildBanData } from "../ts/base";
import { GuildBan, TextChannel, User } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildBanRemove", async (ban) => {
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
        let guild_data: Promise<AuditGuildData | null> | AuditGuildData | null = global_context.neko_modules_clients.db.fetch_audit_guild(ban.guild.id);
        let guild_bans: Promise<GuildBanData[]> | GuildBanData[] = global_context.neko_modules_clients.db.fetch_guild_bans(ban.guild.id);
        guild_data = await guild_data;
        guild_bans = await guild_bans;
        if (guild_data === null) {
            return;
        }

        /* Remove ban */
        const previous_ban = guild_bans.find((e) => {
            return e.user_ID === ban.user.id;
        });
        if (previous_ban !== undefined) {
            global_context.neko_modules_clients.db.remove_guild_ban(previous_ban.id);
        }

        /* Process audit logging */
        if (guild_data.audit_bans === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }
            const audits = await ban.guild.fetchAuditLogs({ limit: 1 }).catch((e: Error) => {
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

            if (audit.action === "MEMBER_BAN_REMOVE" && audit.target.id === ban.user.id) {
                const executor = audit.executor.id === global_context.bot.user.id ? moderation_action.moderator : audit.executor.id;
                const url = ban.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBan = {
                    author: {
                        name: `Case ${guild_data.case_ID}# | Unban | ${ban.user.tag}`,
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
                            value: `<@${executor}>`,
                            inline: true,
                        },
                        {
                            name: "Reason:",
                            value: audit.reason === null ? "None" : audit.reason,
                        },
                    ],
                };
                channel.send({ embeds: [embedBan] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });

                guild_data.case_ID += 1;
                global_context.neko_modules_clients.db.edit_audit_guild(guild_data);
            }
        }
    },
} as Callback;
