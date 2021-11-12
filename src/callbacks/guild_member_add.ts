/* Types */
import { GlobalContext, Callback, GuildMuteData, GuildData } from "../ts/base";
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
        let guild_data: Promise<GuildData | null> | GuildData | null = global_context.neko_modules_clients.db.fetch_guild(member.guild.id, 0);
        let guild_mutes: Promise<GuildMuteData[]> | GuildMuteData[] = global_context.neko_modules_clients.db.fetch_guild_mutes(member.guild.id);
        guild_data = await guild_data;
        guild_mutes = await guild_mutes;
        if (guild_data === null) {
            return;
        }

        /* Process welcome messages */
        if (guild_data.welcome_messages === true && guild_data.welcome_messages_channel !== null) {
            const format = guild_data.welcome_messages_format.replace("<user>", guild_data.welcome_messages_ping ? `${member.toString()}` : `**${member.user.tag}**`);
            const channel = await global_context.bot.channels.fetch(guild_data.welcome_messages_channel).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel instanceof TextChannel) {
                channel.send(format).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        /* Process auto roles */
        guild_data.auto_roles.forEach((id) => {
            member.roles.add(id).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        });

        /* Check if user is bypassing mute */
        if (guild_data.mute_role_ID !== null) {
            if (
                guild_mutes.some((e) => {
                    return e.user_ID === member.user.id;
                })
            ) {
                member.roles.add(guild_data.mute_role_ID).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }
    },
} as Callback;
