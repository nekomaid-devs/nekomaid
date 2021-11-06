/* Types */
import { GlobalContext, GuildData, ServerUserData } from "../ts/base";

/* Node Imports */
import * as axios from "axios";
import * as sql from "mysql2";
import * as NekoClient from "nekos.life";
import * as akaneko from "akaneko";
import * as osu from "node-osu";
import * as Sentry from "@sentry/node";
import { readFileSync } from "fs";

/* Local Imports */
import VoiceManager from "../scripts/managers/manager_voice";
import ModerationManager from "../scripts/managers/manager_moderation";
import LevelingManager from "../scripts/managers/manager_leveling";
import BuildingManager from "../scripts/managers/manager_building";
import EventManager from "../scripts/managers/manager_event";
import InventoryManager from "../scripts/managers/manager_inventory";
import ReactionRolesManager from "../scripts/managers/manager_reaction_roles";
import CounterManager from "../scripts/managers/manager_counter";
import SupportManager from "../scripts/managers/manager_support";
import UpvoteManager from "../scripts/managers/manager_upvote";
import MarriageManager from "../scripts/managers/manager_marriage";
import E621API from "../scripts/apis/api_e621";
import DanbooruAPI from "../scripts/apis/api_danbooru";
import SafebooruAPI from "../scripts/apis/api_safebooru";
import NHentaiAPI from "../scripts/apis/api_nhentai";
import RealbooruAPI from "../scripts/apis/api_realbooru";
import XBooruAPI from "../scripts/apis/api_xbooru";
import GelbooruAPI from "../scripts/apis/api_gelbooru";
import Rule34API from "../scripts/apis/api_rule34";
import * as timeConvert from "../scripts/utils/util_time_convert";
import Database from "../scripts/db/db";

export default async function import_into_context(global_context: GlobalContext) {
    const t_start = global_context.modules.performance.now();

    // Import modules

    // Import fetch modules
    global_context.modules.axios = axios;

    // Import Youtube modules
    global_context.modules.ytinfo = require("youtube.get-video-info");
    /*
     * ^^ THIS ONE HAS ADDED FOLLOWING CODE (otherwise doesn't work)
     * '&eurl=https%3A%2F%2Fyoutube.googleapis.com%2Fv%2Fonz2k4zoLjQ&html5=1&c=TVHTML5&cver=7.20190319' on line 17
     */

    /*
     * ^^ THIS ONE NEEDS TO HAVE 'node-ytdl-core' UPDATED TO 4.8.3 MANUALLY
     * INSTALL 'node-ytdl-core@latest', UPDATE 'package.json' FOR 'ytdl-core-discord' AND DROP 'node-ytdl-core' INTO 'node_modules' IN 'ytdl-core-discord'
     */

    // Import API modules
    global_context.modules.neko = NekoClient;
    global_context.modules.akaneko = akaneko;

    const t_modules_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished loading modules (took ${(t_modules_end - t_start).toFixed(1)}ms)...`);

    // Setup modules
    if (global_context.config.sentry_enabled === true) {
        Sentry.init({
            dsn: global_context.config.sentry_dns,
            integrations: [ new Sentry.Integrations.Http({ tracing: true }) ],

            tracesSampleRate: 1.0,
        });
    }

    // Setup extra utils
    global_context.utils.pick_random = (array: any[]) => {
        return array[Math.floor(Math.random() * array.length)];
    };
    global_context.utils.shuffle_array = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };
    global_context.utils.shuffle_playlist = (playlist: any[]) => {
        playlist = playlist
            .map((a) => {
                return { sort: Math.random(), value: a };
            })
            .sort((a, b) => {
                return a.sort - b.sort;
            })
            .map((a) => {
                return a.value;
            });
        return playlist;
    };
    global_context.utils.get_level_XP = (server_config: GuildData, author_config: ServerUserData) => {
        let level_XP = server_config.module_level_level_exp;
        for (let i = 1; i < author_config.level; i++) {
            level_XP *= server_config.module_level_level_multiplier;
        }

        return level_XP;
    };
    global_context.utils.format_number = (n: number) => {
        /*
         *if (n < 1e3) { return n; }
         *if (n >= 1e3 && n < 1e6) { return +(n / 1e3).toFixed(2) + "K"; }
         *if (n >= 1e6 && n < 1e9) { return +(n / 1e6).toFixed(2) + "M"; }
         *if (n >= 1e9 && n < 1e12) { return +(n / 1e9).toFixed(2) + "B"; }
         *if (n >= 1e12) { return +(n / 1e12).toFixed(2) + "T"; }
         */

        return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    };

    const t_utils_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished loading utils (took ${(t_utils_end - t_modules_end).toFixed(1)}ms)...`);

    // Setup MySQL
    const sql_connection = sql
        .createConnection({
            host: global_context.config.sql_host,
            user: global_context.config.sql_user,
            password: global_context.config.sql_password,
            database: global_context.config.sql_database,
            charset: "utf8mb4",
        })
        .promise();
    await sql_connection.connect().catch((e: Error) => {
        global_context.logger.error(e);
    });

    const t_sql_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished establishing SQL connection (took ${(t_sql_end - t_utils_end).toFixed(1)}ms)...`);

    // Setup Nekomaid's modules
    global_context.neko_modules_clients.db = new Database(sql_connection);
    global_context.neko_modules_clients.r34 = new Rule34API();
    global_context.neko_modules_clients.gelbooru = new GelbooruAPI();
    global_context.neko_modules_clients.xbooru = new XBooruAPI();
    global_context.neko_modules_clients.realbooru = new RealbooruAPI();
    global_context.neko_modules_clients.nhentai = new NHentaiAPI();
    global_context.neko_modules_clients.safebooru = new SafebooruAPI();
    global_context.neko_modules_clients.danbooru = new DanbooruAPI();
    global_context.neko_modules_clients.e621 = new E621API();
    global_context.neko_modules_clients.marriageManager = new MarriageManager();
    global_context.neko_modules_clients.voiceManager = new VoiceManager();
    global_context.neko_modules_clients.upvoteManager = new UpvoteManager();
    global_context.neko_modules_clients.supportManager = new SupportManager();
    global_context.neko_modules_clients.counterManager = new CounterManager();
    global_context.neko_modules_clients.reactionRolesManager = new ReactionRolesManager();
    global_context.neko_modules_clients.inventoryManager = new InventoryManager();
    global_context.neko_modules_clients.eventManager = new EventManager();
    global_context.neko_modules_clients.buildingManager = new BuildingManager();
    global_context.neko_modules_clients.levelingManager = new LevelingManager();
    global_context.neko_modules_clients.moderationManager = new ModerationManager();

    global_context.neko_modules.timeConvert = timeConvert;

    if (global_context.config.osu_enabled === true) {
        global_context.modules_clients.osu = new osu.Api(global_context.config.osu_API_key, { notFoundAsError: false, completeScores: true });
    }

    // Setup other stupid stuff
    global_context.data.uptime_start = new Date().getTime();
    global_context.data.total_events = 0;
    global_context.data.processed_events = 0;
    global_context.data.total_messages = 0;
    global_context.data.processed_messages = 0;
    global_context.data.total_commands = 0;
    global_context.data.processed_commands = 0;
    global_context.data.user_cooldowns = new Map();
    global_context.data.economy_list = [];
    global_context.data.last_moderation_actions = new Map();
    global_context.data.openings = JSON.parse(readFileSync(`${process.cwd()}/configs/data/openings.json`).toString());

    global_context.data.default_headers = {
        "Content-Type": "application/json",
        Authorization: global_context.config.nekomaid_API_key,
        Origin: global_context.config.nekomaid_API_endpoint,
    };

    const t_modules_2_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished setting up the modules (took ${(t_modules_2_end - t_sql_end).toFixed(1)}ms)...`);

    return global_context;
}
