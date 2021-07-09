module.exports = {
    async import_into_context(global_context) {
        let t_start = global_context.modules.performance.now();

        //Import modules
        global_context.modules.crypto = require("crypto");

        //Import fetch modules
        global_context.modules.cheerio = require("cheerio");
        global_context.modules.axios = require("axios");
        global_context.modules.xmlconvert = require("xml-js");
        global_context.modules.fetch = require("node-fetch");

        //Import SQL modules
        global_context.modules.sql = require("mysql2");
        
        //Import Youtube modules
        global_context.modules.ytlist = require("ytpl");
        global_context.modules.ytsr = require("ytsr");

        global_context.modules.ytinfo = require("youtube.get-video-info");
        // ^^ THIS ONE HAS ADDED FOLLOWING CODE (otherwise doesn't work)
        // '&eurl=https%3A%2F%2Fyoutube.googleapis.com%2Fv%2Fonz2k4zoLjQ&html5=1&c=TVHTML5&cver=7.20190319' on line 17

        global_context.modules.ytdl = require("ytdl-core-discord");
        // ^^ THIS ONE NEEDS TO HAVE 'node-ytdl-core' UPDATED TO 4.8.3 MANUALLY
        // INSTALL 'node-ytdl-core@latest', UPDATE 'package.json' FOR 'ytdl-core-discord' AND DROP 'node-ytdl-core' INTO 'node_modules' IN 'ytdl-core-discord'

        //Import image modules
        global_context.modules.jimp = require("jimp");

        //Import API modules
        global_context.modules.NekoClient = require("nekos.life");
        global_context.modules.akaneko = require("akaneko");

        //Import Sentry modules
        if(global_context.config.sentry_enabled === true) {
            global_context.modules.Sentry = require("@sentry/node");
            global_context.modules.Tracing = require("@sentry/tracing");
        }

        let t_modules_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished loading modules (took ${(t_modules_end- t_start).toFixed(1)}ms)...`);
        
        //Setup modules
        global_context.modules_clients.neko = new global_context.modules.NekoClient();
        if(global_context.config.sentry_enabled === true) {
            global_context.modules.Sentry.init({
                dsn: global_context.config.sentry_dns,
                integrations: [
                    new global_context.modules.Sentry.Integrations.Http({ tracing: true }),
                ],

                tracesSampleRate: 1.0,
            });
        }

        //Setup extra utils
        global_context.utils.pick_random = (array) => {
            return array[Math.floor(Math.random() * array.length)];
        }
        global_context.utils.shuffle_array = (array) => {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        global_context.utils.shuffle_playlist = (playlist) => {
            playlist = playlist.map(a => { return { sort: Math.random(), value: a }; }).sort((a, b) => { return a.sort - b.sort; }).map(a => { return a.value; });
            return playlist;
        }
        global_context.utils.verify_guild_channels = async(guild) => {
            if(global_context.cached_all_channels.includes(guild.id) === false) {
                await guild.channels.fetch().catch(e => { global_context.logger.api_error(e); });
                global_context.cached_all_channels.push(guild.id);
            }
        }
        global_context.utils.verify_guild_roles = async(guild) => {
            if(global_context.cached_all_roles.includes(guild.id) === false) {
                await guild.roles.fetch().catch(e => { global_context.logger.api_error(e); });
                global_context.cached_all_roles.push(guild.id);
            }
        }
        global_context.utils.verify_guild_members = async(guild) => {
            if(global_context.cached_all_members.includes(guild.id) === false) {
                await guild.members.fetch().catch(e => { global_context.logger.api_error(e); });
                global_context.cached_all_members.push(guild.id);
            }
        }
        global_context.utils.get_level_XP = (server_config, author_config) => {
            let level_XP = server_config.module_level_level_exp;
            for(let i = 1; i < author_config.level; i++) {
                level_XP *= server_config.module_level_level_multiplier;
            }

            return level_XP;
        }
        global_context.utils.get_building_price = (level, building_name) => {
            let prices = {
                b_city_hall:     [0, 25000, 50000, 100000, 150000, 300000, 500000, 1000000, 2500000, 5000000, 10000000],
                b_bank:          [0, 10000, 25000, 40000, 75000, 100000, 125000, 250000, 500000, 1000000, 3000000],
                b_lab:           [0, 20000, 75000, 100000, 125000, 150000, 250000, 275000, 600000, 1250000, 3500000],
                b_sanctuary:     [0, 15000, 35000, 50000, 90000, 110000, 135000, 265000, 540000, 1100000, 3250000],
                b_pancakes:      [0, 25000, 50000, 100000, 150000, 300000, 500000, 1000000, 1300000, 2000000, 3500000],
                b_crime_den:     [0, 30000, 75000, 150000, 250000, 450000, 750000, 1400000, 1950000, 2600000, 40000000],
                b_lewd_services: [0, 45000, 70000, 125000, 250000, 500000, 700000, 1300000, 2000000, 3000000, 4500000],
                b_casino:        [0, 50000, 100000, 175000, 350000, 650000, 950000, 1800000, 2500000, 3750000, 50000000],
                b_scrapyard:     [0, 100000, 150000, 250000, 500000, 750000, 1500000, 2500000, 4500000, 7500000, 10000000],
                b_pawn_shop:     [0, 80000, 125000, 225000, 450000, 700000, 1250000, 2000000, 3800000, 5000000, 7500000],

                b_mayor_house:      [0, 250000, 450000, 1250000, 3000000, 5000000, 25000000, 50000000, 100000000, 125000000, 300000000],
                b_shrine:           [0, 100000, 210000, 700000, 1500000, 2250000, 10000000, 25000000, 60000000, 100000000, 250000000],
                b_community_center: [0, 125000, 275000, 750000, 1750000, 2500000, 12500000, 27500000, 65000000, 105000000, 260000000],
                b_quantum_pancakes: [0, 150000, 350000, 900000, 2500000, 4000000, 18000000, 35000000, 75000000, 115000000, 280000000],
                b_crime_monopoly:   [0, 200000, 400000, 1100000, 3000000, 4500000, 20000000, 40000000, 90000000, 120000000, 295000000],
                b_pet_shelter:      [0, 140000, 300000, 775000, 2000000, 3000000, 15000000, 30000000, 70000000, 110000000, 275000000]
            }

            return prices[building_name][level + 1];
        }
        global_context.utils.get_building_field = (building_name) => {
            let buildings = {
                "Neko's City Hall": "b_city_hall",
                "Neko's Bank": "b_bank",
                "Neko's Lab": "b_lab",
                "Neko's Sanctuary": "b_sanctuary",
                "Neko's Pancakes": "b_pancakes",
                "Neko's Crime Den": "b_crime_den",
                "Neko's Lewd Services": "b_lewd_services",
                "Neko's Casino": "b_casino",
                "Neko's Scrapyard": "b_scrapyard",
                "Neko's Pawn Shop": "b_pawn_shop"
            }

            return buildings[building_name];
        }
        global_context.utils.get_global_building_field = (building_name) => {
            let buildings = {
                "Neko's Mayor House": "b_mayor_house",
                "Neko's Shrine": "b_shrine",
                "Neko's Lab": "b_lab",
                "Neko's Community Center": "b_community_center",
                "Neko's Quantum Pancakes": "b_quantum_pancakes",
                "Neko's Crime Monopoly": "b_crime_monopoly",
                "Neko's Pet Shelter": "b_pet_shelter"
            }

            return buildings[building_name];
        }
        global_context.utils.format_number = (n) => {
            /*if (n < 1e3) { return n; }
            if (n >= 1e3 && n < 1e6) { return +(n / 1e3).toFixed(2) + "K"; }
            if (n >= 1e6 && n < 1e9) { return +(n / 1e6).toFixed(2) + "M"; }
            if (n >= 1e9 && n < 1e12) { return +(n / 1e9).toFixed(2) + "B"; }
            if (n >= 1e12) { return +(n / 1e12).toFixed(2) + "T"; }*/

            return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }

        let t_utils_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished loading utils (took ${(t_utils_end - t_modules_end).toFixed(1)}ms)...`);

        //Setup SQL
        let sql_connection = global_context.modules.sql.createConnection({
            host: global_context.config.sql_host,
            user: global_context.config.sql_user,
            password: global_context.config.sql_password,
            database: global_context.config.sql_database,
            charset: "utf8mb4"
        });
        await sql_connection.promise().connect().catch(e => {
            global_context.logger.error(e);
        });

        let t_sql_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished establishing SQL connection (took ${(t_sql_end - t_utils_end).toFixed(1)}ms)...`);

        //Setup Nekomaid's modules
        global_context.neko_modules.ServerStructureManager = require('./scripts/data/server_structure_manager');
        global_context.neko_modules_clients.ssm = new global_context.neko_modules.ServerStructureManager(sql_connection);

        global_context.neko_modules.Rule34API = require('./scripts/apis/rule34_api');
        global_context.neko_modules_clients.r34 = new global_context.neko_modules.Rule34API();

        global_context.neko_modules.GelbooruAPI = require('./scripts/apis/gelbooru_api');
        global_context.neko_modules_clients.gelbooru = new global_context.neko_modules.GelbooruAPI();

        global_context.neko_modules.XBooruAPI = require('./scripts/apis/xbooru_api');
        global_context.neko_modules_clients.xbooru = new global_context.neko_modules.XBooruAPI();

        global_context.neko_modules.RealbooruAPI = require('./scripts/apis/realbooru_api');
        global_context.neko_modules_clients.realbooru = new global_context.neko_modules.RealbooruAPI();

        global_context.neko_modules.NHentaiAPI = require('./scripts/apis/nhentai_api');
        global_context.neko_modules_clients.nhentai = new global_context.neko_modules.NHentaiAPI();

        global_context.neko_modules.SafebooruAPI = require('./scripts/apis/safebooru_api');
        global_context.neko_modules_clients.safebooru = new global_context.neko_modules.SafebooruAPI();

        global_context.neko_modules.DanbooruAPI = require('./scripts/apis/danbooru_api');
        global_context.neko_modules_clients.danbooru = new global_context.neko_modules.DanbooruAPI();

        global_context.neko_modules.E621API = require('./scripts/apis/e621_api');
        global_context.neko_modules_clients.e621 = new global_context.neko_modules.E621API();

        global_context.neko_modules.TimeConvert = require('./scripts/utils/util_timeconvert');
        global_context.neko_modules_clients.tc = new global_context.neko_modules.TimeConvert();

        global_context.neko_modules.SortBy = require('./scripts/utils/util_sortby');
        global_context.neko_modules_clients.sb = new global_context.neko_modules.SortBy();

        global_context.neko_modules.LevelingManager = require('./scripts/modules/module_level_manager');
        global_context.neko_modules_clients.lvl = new global_context.neko_modules.LevelingManager();

        global_context.neko_modules.ModerationManager = require('./scripts/modules/module_moderation_manager');
        global_context.neko_modules_clients.moderator = new global_context.neko_modules.ModerationManager();

        global_context.neko_modules.MarriageProposal = require('./scripts/helpers/marriage_proposal');
        global_context.neko_modules.VoiceData = require('./scripts/helpers/voice_data');
        global_context.neko_modules.VoiceRequest = require('./scripts/helpers/voice_request');

        global_context.neko_modules.MarriageManager = require('./scripts/managers/marriage_manager');
        global_context.neko_modules_clients.mm = new global_context.neko_modules.MarriageManager();

        global_context.neko_modules.VoiceManager = require('./scripts/managers/voice_manager');
        global_context.neko_modules_clients.vm = new global_context.neko_modules.VoiceManager();

        global_context.neko_modules.UpvoteManager = require('./scripts/managers/upvote_manager');
        global_context.neko_modules_clients.um = new global_context.neko_modules.UpvoteManager();

        global_context.neko_modules.SupportServerManager = require('./scripts/managers/supportserver_manager');
        global_context.neko_modules_clients.supm = new global_context.neko_modules.SupportServerManager();

        global_context.neko_modules.CounterManager = require('./scripts/managers/counter_manager');
        global_context.neko_modules_clients.cm = new global_context.neko_modules.CounterManager();

        global_context.neko_modules.ReactionRolesManager = require('./scripts/managers/rr_manager');
        global_context.neko_modules_clients.rrm = new global_context.neko_modules.ReactionRolesManager();

        global_context.neko_modules.InventoryManager = require('./scripts/managers/inventory_manager');
        global_context.neko_modules_clients.im = new global_context.neko_modules.InventoryManager();

        global_context.neko_modules.EventManager = require('./scripts/managers/event_manager');
        global_context.neko_modules_clients.em = new global_context.neko_modules.EventManager();

        if(global_context.config.osu_enabled === true) {
            global_context.modules.OsuAPI = require('node-osu');
            global_context.modules_clients.osu = new global_context.modules.OsuAPI.Api(global_context.config.osu_API_key, { notFoundAsError: false, completeScores: true });
        }

        global_context.modules.io = require('socket.io-client');

        global_context.neko_modules.web_updates = require('./scripts/web_updates/web_updates');
        global_context.neko_modules.vars = require('./scripts/utils/util_vars');

        //Setup other stupid stuff
        global_context.data.uptime_start = new Date().getTime();
        global_context.data.total_events = 0;
        global_context.data.processed_events = 0;
        global_context.data.total_messages = 0;
        global_context.data.processed_messages = 0;
        global_context.data.total_commands = 0;
        global_context.data.processed_commands = 0;
        
        global_context.data.last_moderation_actions = new Map();
        global_context.data.openings = global_context.utils.read_JSON("/data/openings.json");

        global_context.data.default_headers = {
            "Content-Type": 'application/json',
            "Authorization": global_context.config.nekomaid_API_key,
            "Origin": global_context.config.nekomaid_API_endpoint
        }

        let t_modules_2_end = global_context.modules.performance.now();
        global_context.logger.log(`Finished setting up the modules (took ${(t_modules_2_end - t_sql_end).toFixed(1)}ms)...`);

        return global_context;
    }
}