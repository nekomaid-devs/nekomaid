/* Types */
import { Callback, Command, Config, GlobalContext } from "../ts/base";
import Discord from "discord.js-light";

/* Node Imports */
import { readFileSync } from "fs";
import { performance } from "perf_hooks";
import * as sql from "mysql2";
import * as osu from "node-osu";
import * as Sentry from "@sentry/node";

/* Local Imports */
import * as bot_commands from "../commands";
import * as bot_callbacks from "../callbacks";

import VoiceManager from "../scripts/managers/manager_voice";
import ModerationManager from "../scripts/managers/manager_moderation";
import LevelingManager from "../scripts/managers/manager_leveling";
import BuildingManager from "../scripts/managers/manager_building";
import InventoryManager from "../scripts/managers/manager_inventory";
import ReactionRolesManager from "../scripts/managers/manager_reaction_roles";
import CounterManager from "../scripts/managers/manager_counter";
import UpvoteManager from "../scripts/managers/manager_upvote";
import MarriageManager from "../scripts/managers/manager_marriage";
import Database from "../scripts/db/db";
import Logger from "../scripts/helpers/logger";
import { get_top } from "../scripts/utils/util_sort";
import { refresh_bot_list, refresh_status, refresh_website } from "../scripts/utils/util_web";

async function run() {
    // Load config
    const config: Config = JSON.parse(readFileSync(`${process.cwd()}/configs/default.json`).toString());

    // Setup SQL connection
    const sql_connection = sql
        .createConnection({
            host: config.sql_host,
            user: config.sql_user,
            password: config.sql_password,
            database: config.sql_database,
            charset: "utf8mb4",
        })
        .promise();
    await sql_connection.connect().catch((e: Error) => {
        global_context.logger.error(e as Error);
    });

    // Setup Discord client
    const bot = new Discord.Client({
        makeCache: Discord.Options.cacheWithLimits({
            ApplicationCommandManager: { maxSize: 0 },
            BaseGuildEmojiManager: { maxSize: 0 },
            ChannelManager: { maxSize: 256 },
            GuildManager: { maxSize: 256 },
            GuildChannelManager: { maxSize: 256 },
            GuildEmojiManager: { maxSize: 0 },
            GuildMemberManager: { maxSize: 0 },
            GuildBanManager: { maxSize: 0 },
            GuildInviteManager: { maxSize: 0 },
            GuildStickerManager: { maxSize: 0 },
            MessageManager: { maxSize: 0 },
            PresenceManager: { maxSize: 0 },
            PermissionOverwriteManager: { maxSize: 256 },
            ReactionManager: { maxSize: 0 },
            ReactionUserManager: { maxSize: 0 },
            RoleManager: { maxSize: 256 },
            StageInstanceManager: { maxSize: 0 },
            ThreadManager: { maxSize: 0 },
            ThreadMemberManager: { maxSize: 0 },
            UserManager: { maxSize: 0 },
            VoiceStateManager: { maxSize: 0 },
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

    // Create global context
    const global_context: GlobalContext = {
        config: config,
        bot: bot,

        commands: new Map(),
        command_aliases: new Map(),
        user_cooldowns: new Map(),

        modules: {
            ytinfo: require("youtube.get-video-info"),
        },
        modules_clients: {
            osu: null,
        },

        neko_modules_clients: {
            db: new Database(sql_connection),
            marriageManager: new MarriageManager(),
            voiceManager: new VoiceManager(),
            upvoteManager: new UpvoteManager(),
            counterManager: new CounterManager(),
            reactionRolesManager: new ReactionRolesManager(),
            inventoryManager: new InventoryManager(),
            buildingManager: new BuildingManager(),
            levelingManager: new LevelingManager(),
            moderationManager: new ModerationManager(),
        },

        logger: new Logger(bot.shard, config.sentry_enabled),
        data: {
            uptime_start: new Date().getTime(),
            shards_ready: false,

            total_events: 0,
            processed_events: 0,
            total_messages: 0,
            processed_messages: 0,
            total_commands: 0,
            processed_commands: 0,
            voice_connections: 0,

            user_cooldowns: new Map(),
            economy_list: [],
            last_moderation_actions: new Map(),
            openings: JSON.parse(readFileSync(`${process.cwd()}/configs/data/openings.json`).toString()),
            default_headers: {
                "Content-Type": "application/json",
                Authorization: config.nekomaid_API_key,
                Origin: config.nekomaid_API_endpoint,
            },
        },
    };

    /* Setup optional */
    if (global_context.config.sentry_enabled === true) {
        Sentry.init({
            dsn: global_context.config.sentry_dns,
            integrations: [new Sentry.Integrations.Http({ tracing: true })],

            tracesSampleRate: 1.0,
        });
    }
    if (global_context.config.osu_enabled === true) {
        global_context.modules_clients.osu = new osu.Api(global_context.config.osu_API_key, { notFoundAsError: false, completeScores: true });
    }

    // Setup utils
    global_context.bot = bot;
    global_context.data.shards_ready = false;
    /*
     *global_context.data.send_upvote_message = (id: string, site_ID: string, is_double: boolean) => {
     *  global_context.neko_modules_clients.upvoteManager.send_upvote_message(global_context, id, site_ID, is_double);
     *};
     *global_context.data.process_upvote = (id: string, site_ID: string, is_double: boolean) => {
     *  global_context.neko_modules_clients.upvoteManager.process_upvote(global_context, id, site_ID, is_double);
     *};
     */

    global_context.logger.log("Started logging into the shard...");
    const t_loading_start = performance.now();

    // Setup commands
    const commands = Object.values(bot_commands);
    commands.forEach((command: Command) => {
        global_context.commands.set(command.name, command);
    });

    // Setup command aliases
    global_context.commands.forEach((command) => {
        if (command.aliases !== undefined) {
            command.aliases.forEach((alias: string) => {
                global_context.command_aliases.set(alias, command.name);
            });
        }
    });

    // Log into Discord
    bot.login(global_context.config.token);

    /* Setup cron jobs */
    setInterval(() => {
        global_context.data.processed_events = global_context.data.processed_events;
        global_context.data.total_events = global_context.data.total_events;
        global_context.data.processed_messages = global_context.data.processed_messages;
        global_context.data.total_messages = global_context.data.total_messages;
        global_context.data.processed_commands = global_context.data.processed_commands;
        global_context.data.total_commands = global_context.data.total_commands;
        global_context.data.voice_connections = global_context.neko_modules_clients.voiceManager.connections.size;
        global_context.neko_modules_clients.voiceManager.tick_connections(global_context);

        global_context.data.processed_events = 0;
        global_context.data.processed_messages = 0;
        global_context.data.processed_commands = 0;
    }, 1000);
    setInterval(() => {
        refresh_status(global_context);
    }, 60000);

    /* Setup cron jobs (1st shard only) */
    if (global_context.bot.shard !== null && global_context.bot.shard.ids[0] === 0) {
        setInterval(() => {
            refresh_website(global_context);
        }, 2000);
        setInterval(() => {
            global_context.neko_modules_clients.buildingManager.update_all_buildings(global_context);
        }, 10000);
        setInterval(() => {
            global_context.neko_modules_clients.moderationManager.timeout_all_bans(global_context);
            global_context.neko_modules_clients.moderationManager.timeout_all_mutes(global_context);
        }, 10000);
        setInterval(() => {
            refresh_bot_list(global_context);
            global_context.neko_modules_clients.counterManager.update_all_counters(global_context);
        }, 60000);
        setInterval(async () => {
            const top_items = await get_top(global_context, ["credits", "bank"]);
            const economy_list = [];
            for (let i = 0; i < (top_items.length < 10 ? top_items.length : 10); i++) {
                const neko_user = top_items[i];
                const user = await global_context.bot.users.fetch(neko_user.id).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if (user !== null) {
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
            }

            global_context.data.economy_list = economy_list;
        }, 60000);
    }

    bot.on("ready", () => {
        const t_logging_end = performance.now();
        global_context.logger.log(`Finished logging into the shard (took ${(t_logging_end - t_loading_start).toFixed(1)}ms)...`);
        global_context.logger.log("-".repeat(30));
        global_context.logger.log(`[Guilds: ${bot.guilds.cache.size}] - [Channels: ${bot.channels.cache.size}] - [Users: ${bot.users.cache.size}]`);

        refresh_status(global_context);
        global_context.neko_modules_clients.reactionRolesManager.create_all_collectors(global_context);

        const callbacks = Object.values(bot_callbacks);
        callbacks.forEach((callback: Callback) => {
            callback.hook(global_context);
        });
    });
    bot.on("ratelimit", (ratelimit) => {
        global_context.logger.log(`Ratelimit: ${ratelimit.timeout} (${ratelimit.path} - ${ratelimit.route})`);
    });
}

run();
