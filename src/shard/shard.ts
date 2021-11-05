/* Types */
import { Callback, Command, GlobalContext } from "../ts/base";
import Discord from "discord.js";

/* Node Imports */
import { readFileSync } from "fs";
import performance from "perf_hooks";

/* Local Imports */
import import_into_context from "./shard_importer";
import * as bot_commands from "../commands";
import * as bot_callbacks from "../callbacks";
import { get_top } from "../scripts/utils/util_sort_by";
import { refresh_bot_list, refresh_status, refresh_website } from "../scripts/utils/util_web";

async function run() {
    //Setup Discord client
    const bot = new Discord.Client({
        makeCache: Discord.Options.cacheWithLimits({
            ApplicationCommandManager: { sweepInterval: 60 },
            BaseGuildEmojiManager: { sweepInterval: 60 },
            GuildEmojiManager: { sweepInterval: 60 },
            GuildMemberManager: { sweepInterval: 60 },
            GuildBanManager: { sweepInterval: 60 },
            GuildInviteManager: { sweepInterval: 60 },
            GuildStickerManager: { sweepInterval: 60 },
            MessageManager: { sweepInterval: 60 },
            PresenceManager: { sweepInterval: 60 },
            ReactionManager: { sweepInterval: 60 },
            ReactionUserManager: { sweepInterval: 60 },
            StageInstanceManager: { sweepInterval: 60 },
            ThreadManager: { sweepInterval: 60 },
            ThreadMemberManager: { sweepInterval: 60 },
            UserManager: { sweepInterval: 60 },
            VoiceStateManager: { sweepInterval: 60 },
        }),
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_BANS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        ],
    });

    //Create global context
    let global_context: GlobalContext = {
        config: JSON.parse(readFileSync(process.cwd() + "/configs/default.json").toString()),
        bot_config: null,

        bot: bot,

        commands: new Map(),
        command_aliases: new Map(),

        modules: {},
        modules_clients: {},

        neko_data: {},
        neko_modules: {},
        neko_modules_clients: {},

        logger: {},
        utils: {},
        data: {},
    };

    //Import modules
    global_context.modules.Discord = Discord;
    global_context.modules.performance = performance.performance;

    //Setup utils
    global_context.utils.get_formatted_time = () => {
        const date = new Date();
        const h = date.getHours();
        const m = date.getMinutes();
        return (h < 10 ? "0" + h.toString() : h.toString()) + ":" + (m < 10 ? "0" + m.toString() : m.toString());
    };

    global_context.bot = bot;
    global_context.neko_data = {};
    global_context.neko_data.shards_ready = false;
    global_context.neko_data.send_upvote_message = (id: string, site_ID: string, is_double: boolean) => {
        global_context.neko_modules_clients.upvoteManager.send_upvote_message(global_context, id, site_ID, is_double);
    };
    global_context.neko_data.process_upvote = (id: string, site_ID: string, is_double: boolean) => {
        global_context.neko_modules_clients.upvoteManager.process_upvote(global_context, id, site_ID, is_double);
    };

    //Create log colors
    const log_colors = ["\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m", "\x1b[90m", "\x1b[93m", "\x1b[95m", "\x1b[96m", "\x1b[97m"];
    const log_color_shard = log_colors[Math.floor(Math.random() * log_colors.length)];
    const log_color_message = "\x1b[92m";
    const log_color_api_error = "\x1b[94m";
    const log_color_error = "\x1b[31m";
    const log_color_time = "\x1b[91m";

    //Console setup
    global_context.logger.log = () => {
        /* */
    };
    global_context.logger.api_error = () => {
        /* */
    };
    global_context.logger.neko_api_error = () => {
        /* */
    };
    global_context.logger.error = () => {
        /* */
    };

    if (global_context.config.logger_log_log === true) {
        global_context.logger.log = (log_message: string) => {
            if (global_context.bot.shard === null) {
                return;
            }
            process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] " + log_color_shard + "[shard_" + global_context.bot.shard.ids[0] + "] " + log_color_message + log_message + "\x1b[0m\n");
        };
    }
    if (global_context.config.logger_log_api_error === true) {
        global_context.logger.api_error = (error: Error) => {
            if (global_context.bot.shard === null) {
                return;
            }
            const log_message = error.stack === undefined ? error : error.stack;
            process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] [API Error] " + log_color_shard + "[shard_" + global_context.bot.shard.ids[0] + "] " + log_color_api_error + log_message + "\x1b[0m\n");
        };
    }
    if (global_context.config.logger_log_neko_api_error === true) {
        global_context.logger.neko_api_error = (error: Error) => {
            if (global_context.bot.shard === null) {
                return;
            }
            const log_message = error.stack === undefined ? error : error.stack;
            process.stdout.write(
                log_color_time + "[" + global_context.utils.get_formatted_time() + "] [Nekomaid API Error] " + log_color_shard + "[shard_" + global_context.bot.shard.ids[0] + "] " + log_color_api_error + log_message + "\x1b[0m\n"
            );
        };
    }
    if (global_context.config.logger_log_error === true) {
        global_context.logger.error = (error: Error) => {
            if (global_context.bot.shard === null) {
                return;
            }
            const log_message = error.stack === undefined ? error : error.stack;
            process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] [Error] " + log_color_shard + "[shard_" + global_context.bot.shard.ids[0] + "] " + log_color_error + log_message + "\x1b[0m\n");
        };
    }

    global_context.logger.log("Started logging into the shard...");
    const t_loading_start = global_context.modules.performance.now();

    //Setup commands
    const commands = Object.values(bot_commands);
    commands.forEach((command: Command) => {
        global_context.commands.set(command.name, command);
    });

    //Setup command aliases
    global_context.commands.forEach((command) => {
        if (command.aliases !== undefined) {
            command.aliases.forEach((alias: string) => {
                global_context.command_aliases.set(alias, command.name);
            });
        }
    });

    //Log into Discord
    bot.login(global_context.config.token);

    let last_timestamp = Date.now();
    setInterval(() => {
        global_context.neko_data.processed_events = global_context.data.processed_events;
        global_context.neko_data.total_events = global_context.data.total_events;
        global_context.neko_data.processed_messages = global_context.data.processed_messages;
        global_context.neko_data.total_messages = global_context.data.total_messages;
        global_context.neko_data.processed_commands = global_context.data.processed_commands;
        global_context.neko_data.total_commands = global_context.data.total_commands;
        if (global_context.neko_modules_clients.voiceManager !== undefined) {
            global_context.neko_data.voiceManager_connections = global_context.neko_modules_clients.voiceManager.connections.size;
            global_context.neko_modules_clients.voiceManager.tick_connections(global_context);
        }

        global_context.data.processed_events = 0;
        global_context.data.processed_messages = 0;
        global_context.data.processed_commands = 0;
    }, 1000);
    setInterval(() => {
        if (global_context.bot.shard === null) {
            return;
        }
        if (global_context.bot.shard.ids[0] === 0) {
            refresh_website(global_context);
        }
    }, 2000);
    setInterval(async () => {
        if (global_context.bot.shard === null) {
            return;
        }
        if (global_context.neko_modules_clients.eventManager !== undefined && global_context.bot.shard.ids[0] === 0) {
            const date = new Date();
            if (date.getHours() % 2 === 0 && date.getMinutes() === 0 && Date.now() > last_timestamp + 1000 * 60) {
                global_context.neko_modules_clients.eventManager.spawn_event(global_context, global_context.config.events_channel_ID);
                last_timestamp = Date.now();
            }
        }
        if (global_context.neko_modules_clients.buildingManager !== undefined && global_context.bot.shard.ids[0] === 0) {
            global_context.neko_modules_clients.buildingManager.update_all_buildings(global_context);
        }

        // TODO: this will need to get updated somewhere else
        if (global_context.neko_modules_clients.db !== undefined) {
            global_context.bot_config = await global_context.neko_modules_clients.db.fetch_config("default_config");
        }
    }, 10000);
    setInterval(() => {
        if (global_context.neko_modules_clients.moderationManager !== undefined) {
            global_context.neko_modules_clients.moderationManager.timeout_all_bans(global_context);
            global_context.neko_modules_clients.moderationManager.timeout_all_mutes(global_context);
        }
    }, 10000);
    setInterval(() => {
        if (global_context.bot.shard === null) {
            return;
        }
        if (global_context.bot.shard.ids[0] === 0) {
            refresh_bot_list(global_context);
        }
        if (global_context.neko_modules_clients.counterManager !== undefined) {
            global_context.neko_modules_clients.counterManager.update_all_counters(global_context);
        }
    }, 60000);
    setInterval(() => {
        refresh_status(global_context);
    }, 60000);
    setInterval(async () => {
        if (global_context.bot.shard === null) {
            return;
        }
        if (global_context.neko_modules_clients.sortBy !== undefined && global_context.bot.shard.ids[0] === 0) {
            const top_items = await get_top(global_context, ["credits", "bank"]);
            const economy_list = [];
            for (let i = 0; i < (top_items.length < 10 ? top_items.length : 10); i++) {
                const neko_user = top_items[i];
                const user = await global_context.bot.users.fetch(neko_user.user_ID);
                economy_list.push({
                    id: user.id,
                    user: { id: user.id, username: user.username, avatar: user.avatarURL({ format: "png", dynamic: true, size: 1024 }) },
                    neko_user: {
                        credits: neko_user.credits + neko_user.bank,
                        level: neko_user.level,
                        b_city_hall: neko_user.b_city_hall,
                        b_bank: neko_user.b_bank,
                        b_lab: neko_user.b_lab,
                        b_sanctuary: neko_user.b_sanctuary,
                        b_pancakes: neko_user.b_pancakes,
                        b_crime_den: neko_user.b_crime_den,
                        b_lewd_services: neko_user.b_lewd_services,
                        b_casino: neko_user.b_casino,
                        b_scrapyard: neko_user.b_scrapyard,
                        b_pawn_shop: neko_user.b_pawn_shop,
                    },
                });
            }

            global_context.data.economy_list = economy_list;
        }
    }, 60000);

    bot.on("ready", async () => {
        const t_logging_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished logging into the shard (took ${(t_logging_end - t_loading_start).toFixed(1)}ms)...`);
        global_context.logger.log("-".repeat(30));

        //Stuff the bot with goods uwu :pleading_emoji:
        global_context.logger.log(`Started loading the shard...`);
        global_context = await import_into_context(global_context);
        global_context.neko_data.uptime_start = global_context.data.uptime_start;

        const t_loading_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished loading shard (took ${(t_loading_end - t_logging_end).toFixed(1)}ms)...`);
        global_context.logger.log("-".repeat(30));
        global_context.logger.log(`[Guilds: ${bot.guilds.cache.size}] - [Channels: ${bot.channels.cache.size}] - [Users: ${bot.users.cache.size}]`);

        global_context.bot_config = await global_context.neko_modules_clients.db.fetch_config("default_config");
        refresh_status(global_context);
        global_context.neko_modules_clients.reactionRolesManager.create_all_collectors(global_context);

        const callbacks = Object.values(bot_callbacks);
        callbacks.forEach((callback: Callback) => {
            callback.hook(global_context);
        });
    });
    bot.on("ratelimit", (ratelimit) => {
        global_context.logger.log("Ratelimit: " + ratelimit.timeout + " (" + ratelimit.path + " - " + ratelimit.route + ")");
    });
}

run();
