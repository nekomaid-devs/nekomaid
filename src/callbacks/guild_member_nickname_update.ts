/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildMember, TextChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberNicknameChange", async (old_member, new_member) => {
            try {
                await this.process(global_context, old_member, new_member);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, old_member: GuildMember, new_member: GuildMember) {
        // TODO: this doesn't work
        const guild_data = await global_context.neko_modules_clients.db.fetch_audit_guild(new_member.guild.id, false, false);
        if (guild_data === null) {
            return;
        }
        if (guild_data.audit_nicknames === true && guild_data.audit_channel !== null) {
            const channel = await global_context.bot.channels.fetch(guild_data.audit_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            const url = new_member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedNicknameChange = {
                author: {
                    name: `Nickname changed | ${new_member.user.tag}`,
                    icon_url: url === null ? undefined : url,
                },
                fields: [
                    {
                        name: "User:",
                        value: new_member.user.toString(),
                        inline: false,
                    },
                    {
                        name: "Change:",
                        value: `${old_member.nickname === null ? old_member.user.username : old_member.nickname} -> ${new_member.nickname === null ? new_member.user.username : new_member.nickname}`,
                    },
                ],
            };

            channel.send({ embeds: [embedNicknameChange] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    },
} as Callback;
