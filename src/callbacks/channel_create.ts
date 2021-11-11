/* Types */
import { GlobalContext, Callback } from "../ts/base";
import { GuildChannel } from "discord.js-light";

export default {
    hook(global_context: GlobalContext) {
        global_context.bot.on("channelCreate", async (channel) => {
            try {
                await this.process(global_context, channel);
            } catch (e) {
                global_context.logger.error(e as Error);
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context: GlobalContext, channel: GuildChannel) {
        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(channel.guild.id, false, false);
        if (guild_data === null) {
            return;
        }

        /* Create overwrite for mute role on a channel */
        if (guild_data.mute_role_ID !== null) {
            const mute_role = await channel.guild.roles.fetch(guild_data.mute_role_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                return;
            }

            switch (channel.type) {
                case "GUILD_TEXT":
                    channel.permissionOverwrites
                        .create(mute_role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                        })
                        .catch((e: Error) => {
                            global_context.logger.api_error(e);
                        });
                    break;

                case "GUILD_VOICE":
                    channel.permissionOverwrites
                        .create(mute_role, {
                            CONNECT: false,
                            SPEAK: false,
                        })
                        .catch((e: Error) => {
                            global_context.logger.api_error(e);
                        });
                    break;
            }
        }
    },
} as Callback;
