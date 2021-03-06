/* Types */
import { CounterData, GlobalContext } from "../../ts/base";
import { VoiceChannel } from "discord.js-light";
/* Local Imports */
import { get_time_difference } from "../utils/time";

class CounterManager {
    async update_all_counters(global_context: GlobalContext) {
        const all_counters = await global_context.neko_modules_clients.db.fetch_all_counters();
        all_counters.forEach((counter) => {
            global_context.neko_modules_clients.counterManager.update_counter(global_context, counter);
        });
    }

    async update_counter(global_context: GlobalContext, counter: CounterData, force_update = false) {
        if (global_context.bot.shard === null) {
            return;
        }

        const diff = get_time_difference(counter.last_update, 5, 1);
        if (diff.diff >= 5 || force_update === true) {
            counter.last_update = Date.now();

            const guild = await global_context.bot.guilds.fetch(counter.guild_ID);
            const channel = await global_context.bot.channels.fetch(counter.channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof VoiceChannel)) {
                return;
            }

            switch (counter.type) {
                case "all_members": {
                    const member_count = Array.from((await guild.members.fetch()).values()).length;
                    channel.setName(`All Members: ${member_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "members": {
                    const member_count = Array.from((await guild.members.fetch()).values()).filter((e) => {
                        return e.user.bot === false;
                    }).length;
                    channel.setName(`Members: ${member_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "roles": {
                    const roles_count = Array.from((await guild.members.fetch()).values()).length;
                    channel.setName(`Roles: ${roles_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "channels": {
                    const channels_count = Array.from((await guild.members.fetch()).values()).length;
                    channel.setName(`Channels: ${channels_count}`).catch((e) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "bots": {
                    const bot_count = Array.from((await guild.members.fetch()).values()).filter((e) => {
                        return e.user.bot === false;
                    }).length;
                    channel.setName(`Bots: ${bot_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "bot_guilds": {
                    let guild_count = 0;
                    await global_context.bot.shard
                        .fetchClientValues("guilds.cache.size")
                        .then((results: any) => {
                            guild_count = results.reduce((acc: number, curr: number) => {
                                return acc + curr;
                            }, 0);
                        })
                        .catch((e: Error) => {
                            global_context.logger.error(e as Error);
                        });

                    channel.setName(`Current guilds: ${guild_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "bot_users": {
                    let member_count = 0;
                    await global_context.bot.shard
                        .broadcastEval((client) => {
                            return client.guilds.cache.reduce((acc, curr) => {
                                return acc + curr.memberCount;
                            }, 0);
                        })
                        .then((results) => {
                            member_count = results.reduce((acc, curr) => {
                                return acc + curr;
                            }, 0);
                        })
                        .catch((e: Error) => {
                            global_context.logger.error(e as Error);
                        });

                    channel.setName(`Current Users: ${member_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                default: {
                    global_context.logger.error(`Invalid counter type - ${counter.type}.`);
                    break;
                }
            }

            global_context.neko_modules_clients.db.edit_guild_counter(counter);
        }
    }
}

export default CounterManager;
