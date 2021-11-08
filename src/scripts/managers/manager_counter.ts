/* Types */
import { CounterData, GlobalContext } from "../../ts/base";
import { Guild, VoiceChannel } from "discord.js-light";

class CounterManager {
    async update_all_counters(global_context: GlobalContext) {
        const counters = await global_context.neko_modules_clients.db.fetch_all_counters();
        global_context.bot.guilds.cache.forEach((server) => {
            const server_counters = counters.filter((e: CounterData) => {
                return e.server_ID === server.id;
            });
            server_counters.forEach((counter: CounterData) => {
                global_context.neko_modules_clients.counterManager.update_counter(global_context, server, counter);
            });
        });
    }

    async update_counter(global_context: GlobalContext, server: Guild, counter: CounterData, force_update = false) {
        if (global_context.bot.shard === null) {
            return;
        }

        const end = new Date();
        const start = new Date(counter.last_update);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if (diff >= 5 || force_update === true) {
            counter.last_update = end.getTime();

            const channel = await global_context.bot.channels.fetch(counter.channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof VoiceChannel)) {
                return;
            }

            switch (counter.type) {
                case "all_members": {
                    const member_count = Array.from(server.members.cache.values()).length;
                    channel.setName(`All Members: ${member_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "members": {
                    const member_count = Array.from(server.members.cache.values()).filter((e) => {
                        return e.user.bot === false;
                    }).length;
                    channel.setName(`Members: ${member_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "roles": {
                    const roles_count = Array.from(server.members.cache.values()).length;
                    channel.setName(`Roles: ${roles_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "channels": {
                    const channels_count = Array.from(server.members.cache.values()).length;
                    channel.setName(`Channels: ${channels_count}`).catch((e) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "bots": {
                    const bot_count = Array.from(server.members.cache.values()).filter((e) => {
                        return e.user.bot === false;
                    }).length;
                    channel.setName(`Bots: ${bot_count}`).catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                    break;
                }

                case "bot_servers": {
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

                    channel.setName(`Current Servers: ${guild_count}`).catch((e: Error) => {
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

            global_context.neko_modules_clients.db.edit_counter(counter);
        }
    }
}

export default CounterManager;
