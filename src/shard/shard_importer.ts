/* Types */
import { GlobalContext } from "../ts/base";

/* Node Imports */
import * as NekoClient from "nekos.life";
import * as akaneko from "akaneko";
import * as osu from "node-osu";
import * as Sentry from "@sentry/node";
import { readFileSync } from "fs";

export default function import_into_context(global_context: GlobalContext) {
    const t_start = global_context.modules.performance.now();

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
            integrations: [new Sentry.Integrations.Http({ tracing: true })],

            tracesSampleRate: 1.0,
        });
    }

    const t_utils_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished loading utils (took ${(t_utils_end - t_modules_end).toFixed(1)}ms)...`);

    // Setup Nekomaid's modules
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
    global_context.logger.log(`Finished setting up the modules (took ${(t_modules_2_end - t_utils_end).toFixed(1)}ms)...`);

    return global_context;
}
