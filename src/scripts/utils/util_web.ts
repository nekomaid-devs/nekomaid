/* Types */
import { GlobalContext } from "../../ts/base";
import { Client } from "discord.js-light";

/* Local Imports */
import { pick_random } from "../../scripts/utils/util_general";

export async function refresh_status(global_context: GlobalContext) {
    if (global_context.neko_data.shards_ready === false || global_context.bot.shard === null || global_context.bot.user === null) {
        return;
    }

    let guild_count = 0;
    await global_context.bot.shard
        .broadcastEval((client: Client) => {
            return client.guilds.cache.size;
        })
        .then((results) => {
            guild_count = results.reduce((acc, curr) => {
                return acc + curr;
            }, 0);
        })
        .catch((e: Error) => {
            global_context.logger.error(e as Error);
        });

    const statuses = ["V2 live now!"];
    global_context.bot.user.setStatus("online");
    global_context.bot.user.setActivity(`${pick_random(statuses)} | ${guild_count} servers`, { type: "PLAYING" });
}

export function refresh_website(global_context: GlobalContext) {
    if (global_context.neko_data.shards_ready === false || global_context.config.nekomaid_API_update_stats === false || global_context.bot.shard === null) {
        return;
    }

    const shard_list = [];
    for (let i = 0; i < global_context.bot.shard.count; i++) {
        shard_list[i] = { online: true };
    }

    /*
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.uptime_start;
     *  })
     *  .then((results) => {
     *      results.forEach((start, i) => {
     *          shard_list[i].start = start;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.guilds.cache.size;
     *  })
     *  .then((results) => {
     *      results.forEach((guilds, i) => {
     *          shard_list[i].guilds = guilds;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
     *  })
     *  .then((results) => {
     *      results.forEach((users, i) => {
     *          shard_list[i].users = users;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     * // TODO: maybe change this, since we don't cache channels?
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.channels.cache.size;
     *  })
     *  .then((results) => {
     *      results.forEach((channels, i) => {
     *          shard_list[i].channels = channels;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.processed_events;
     *  })
     *  .then((results) => {
     *      results.forEach((processed_events, i) => {
     *          shard_list[i].processed_events = processed_events;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.total_events;
     *  })
     *  .then((results) => {
     *      results.forEach((total_events, i) => {
     *          shard_list[i].total_events = total_events;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.processed_messages;
     *  })
     *  .then((results) => {
     *      results.forEach((processed_messages, i) => {
     *          shard_list[i].processed_messages = processed_messages;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.total_messages;
     *  })
     *  .then((results) => {
     *      results.forEach((total_messages, i) => {
     *          shard_list[i].total_messages = total_messages;
     *      });
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.processed_commands;
     *  })
     *  .then((results) => {
     *      results.forEach((processed_commands, i) => {
     *          shard_list[i].processed_commands = processed_commands;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.total_commands;
     *  })
     *  .then((results) => {
     *      results.forEach((total_commands, i) => {
     *          shard_list[i].total_commands = total_commands;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     *
     *await global_context.bot.shard
     *  .broadcastEval((client) => {
     *      return client.neko_data.voiceManager_connections;
     *  })
     *  .then((results) => {
     *      results.forEach((voice_connections, i) => {
     *          shard_list[i].voice_connections = voice_connections;
     *      });
     *  })
     *  .catch((e: Error) => {
     *      global_context.logger.error(e as Error);
     *  });
     */

    const economy_list = global_context.data.economy_list;
    const command_list = Array.from(global_context.commands.values())
        .filter((e) => {
            return e.hidden === false;
        })
        .reduce((acc: object[], curr) => {
            acc.push({ name: curr.name, description: curr.description, category: curr.category, aliases: curr.aliases });
            return acc;
        }, []);
    const stats = {
        start: global_context.data.uptime_start,
        hosts: 1,

        sentry_online: true,
        analytics_online: true,
        akaneko_online: true,
        uptime_pings: [Array(24).fill({ up: true })],

        shard_list: shard_list,
        economy_list: economy_list,
        command_list: command_list,
    };

    global_context.modules.axios
        .post(
            `${global_context.config.nekomaid_API_endpoint}/v1/stats/post`,
            { stats: stats },
            {
                headers: global_context.data.default_headers,
            }
        )
        .catch((e: Error) => {
            global_context.logger.error(`[Nekomaid API] ${e}`);
        });
}

export async function refresh_bot_list(global_context: GlobalContext) {
    if (global_context.config.dev_mode === true || global_context.config.nekomaid_API_update_bot_lists === false || global_context.bot.shard === null || global_context.bot.user === null) {
        return;
    }

    let guild_count = 0;
    let user_count = 0;
    await global_context.bot.shard
        .broadcastEval((client) => {
            return client.guilds.cache.size;
        })
        .then((results) => {
            guild_count = results.reduce((acc, curr) => {
                return acc + curr;
            }, 0);
        })
        .catch((e: Error) => {
            global_context.logger.error(e as Error);
        });
    await global_context.bot.shard
        .broadcastEval((client) => {
            return client.guilds.cache.reduce((acc, curr) => {
                return acc + curr.memberCount;
            }, 0);
        })
        .then((results) => {
            user_count = results.reduce((acc, curr) => {
                return acc + curr;
            }, 0);
        })
        .catch((e: Error) => {
            global_context.logger.error(e as Error);
        });

    const data_1 = {
        guilds: guild_count,
        users: user_count,
    };
    const data_2 = {
        guildCount: guild_count,
        shardCount: global_context.bot.shard.count,
    };
    const data_3 = {
        server_count: guild_count,
        shard_count: global_context.bot.shard.count,
    };

    const headers_POST_1 = {
        "Content-Type": "application/json",
        Authorization: global_context.config.discord_bot_list_API_key,
    };
    const headers_POST_2 = {
        "Content-Type": "application/json",
        Authorization: global_context.config.discord_bots_API_key,
        "User-Agent": `NekoMaid-4177/1.0 (discord.js; +nekomaid.xyz) DBots/${global_context.bot.user.id}`,
    };
    const headers_POST_3 = {
        "Content-Type": "application/json",
        Authorization: global_context.config.discord_boats_API_key,
    };
    const headers_POST_4 = {
        "Content-Type": "application/json",
        Authorization: global_context.config.bots_for_discord_API_key,
    };
    const headers_POST_5 = {
        "Content-Type": "application/json",
        Authorization: global_context.config.top_gg_API_key,
    };

    global_context.modules.axios
        .post(`https://discordbotlist.com/api/v1/bots/${global_context.bot.user.id}/stats`, data_1, {
            headers: headers_POST_1,
        })
        .catch((e: Error) => {
            global_context.logger.error(`[Discord Botlist] ${e}`);
        });

    global_context.modules.axios
        .post(`https://discord.bots.gg/api/v1/bots/${global_context.bot.user.id}/stats`, data_2, {
            headers: headers_POST_2,
        })
        .catch((e: Error) => {
            global_context.logger.error(`[Discord Bots] ${e}`);
        });

    global_context.modules.axios
        .post(`https://discord.boats/api/bot/${global_context.bot.user.id}`, data_3, {
            headers: headers_POST_3,
        })
        .catch((e: Error) => {
            global_context.logger.error(`[Discord Boats] ${e}`);
        });

    global_context.modules.axios
        .post(`https://botsfordiscord.com/api/bot/${global_context.bot.user.id}`, data_3, {
            headers: headers_POST_4,
        })
        .catch((e: Error) => {
            global_context.logger.error(`[Bots For Discord] ${e}`);
        });

    global_context.modules.axios
        .post(`https://top.gg/api/bots/${global_context.bot.user.id}/stats`, data_3, {
            headers: headers_POST_5,
        })
        .catch((e: Error) => {
            global_context.logger.error(`[Top GG] ${e}`);
        });
}
