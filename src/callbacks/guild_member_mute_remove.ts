/* Types */
import { GlobalContext, Callback, MemberMuteRemoveEventData } from "../ts/base";
import { GuildEditType, GuildFetchType } from "../ts/mysql";
import { TextChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberMuteRemove", async (event) => {
            try {
                await this.process(global_context, event);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, event: MemberMuteRemoveEventData) {
        const server_config = await global_context.neko_modules_clients.db.fetch_server(event.member.guild.id, GuildFetchType.AUDIT, false, false);
        if (server_config === null) {
            return;
        }

        if (server_config.audit_mutes === true && server_config.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            const url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedUnmute = {
                author: {
                    name: `Case ${server_config.case_ID}# | Unmute | ${event.member.user.tag}`,
                    icon_url: url === null ? undefined : url,
                },
                fields: [
                    {
                        name: "User:",
                        value: event.member.toString(),
                        inline: true,
                    },
                    {
                        name: "Moderator:",
                        value: event.moderator.toString(),
                        inline: true,
                    },
                    {
                        name: "Reason:",
                        value: event.reason === null ? "`None`" : event.reason,
                    },
                ],
            };

            server_config.case_ID += 1;
            global_context.neko_modules_clients.db.edit_server(server_config, GuildEditType.AUDIT);

            channel.send({ embeds: [embedUnmute] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }

        global_context.neko_modules_clients.db.remove_server_mute(event.previous_mute.id);
    },
} as Callback;
