/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildMember, TextChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("guildMemberAdd", async (member) => {
            try {
                await this.process(global_context, member);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, member: GuildMember) {
        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(member.guild.id, false, false);
        if (guild_data === null) {
            return;
        }
        const guild_mutes = await global_context.neko_modules_clients.db.fetch_guild_mutes(member.guild.id);

        member.guild.roles.cache
            .filter((e) => {
                return guild_data.auto_roles.includes(e.id);
            })
            .forEach((role) => {
                member.roles.add(role).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            });

        if (guild_data.mute_role_ID !== null) {
            const mute_role = await member.guild.roles.fetch(guild_data.mute_role_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                return;
            }
            if (
                guild_mutes.some((e) => {
                    return e.user_ID === member.user.id;
                })
            ) {
                member.roles.add(mute_role).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        if (guild_data.welcome_messages === true && guild_data.welcome_messages_channel !== null) {
            let format = guild_data.welcome_messages_format;
            const member_display_name = guild_data.welcome_messages_ping ? `${member.toString()}` : `**${member.user.tag}**`;
            format = format.replace("<user>", member_display_name);

            const channel = await global_context.bot.channels.fetch(guild_data.welcome_messages_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (!(channel instanceof TextChannel)) {
                return;
            }

            channel.send(format).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }
    },
} as Callback;
