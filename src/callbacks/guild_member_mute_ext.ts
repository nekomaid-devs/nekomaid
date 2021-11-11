/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { MemberMuteExtensionEventData } from "../ts/callbacks";
import { TextChannel } from "discord.js-light";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberMuteExt", async (event) => {
            try {
                await this.process(global_context, event);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, event: MemberMuteExtensionEventData) {
        const guild_data = await global_context.neko_modules_clients.db.fetch_audit_guild(event.member.guild.id, false, false);
        if (guild_data === null) {
            return;
        }

        /* Add mute */
        const guild_mute = {
            id: randomBytes(16).toString("hex"),
            guild_ID: event.member.guild.id,
            user_ID: event.member.user.id,
            reason: event.reason,
            start: event.mute_start,
            end: event.time === -1 ? -1 : event.mute_end,
        };

        global_context.neko_modules_clients.db.add_guild_mute(guild_mute);

        /* Process audit loggging */
        if (guild_data.audit_mutes === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            const url = event.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedMute = {
                author: {
                    name: `Case ${guild_data.case_ID}# | Mute Extension | ${event.member.user.tag}`,
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
                    {
                        name: "Duration:",
                        value: `${event.prev_duration} -> ${event.next_duration}`,
                    },
                ],
            };
            channel.send({ embeds: [embedMute] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });

            guild_data.case_ID += 1;
            global_context.neko_modules_clients.db.edit_audit_guild(guild_data);
        }
    },
} as Callback;
