module.exports = {
    importIntoBot(bot, mainClass) {
        //Global Setup
        bot.fs = require('fs');
        bot.cheerio = require("cheerio");
        bot.axios = require("axios");
        bot.sql = require('mysql2');
        bot.processUsage = require('pidusage');
        bot.ytdl = require('ytdl-core-discord');
        bot.ytlist = require('ytpl');
        bot.crypto = require("crypto");
        bot.jimp = require('jimp');
        bot.NekoClient = require('nekos.life');
        bot.xmlconvert = require('xml-js');
        bot.neko = new bot.NekoClient();
        bot.ps = require('ps-node');
        bot.fetch = require('node-fetch');
        bot.ytsr = require('ytsr');
        bot.ytinfo = require('youtube.get-video-info');
        bot.akaneko = require('akaneko');

        //Load persistentConfig
        var path1 = process.cwd() + "/botData/config_persistent.json";
        var globalPersistentConfigData = bot.fs.readFileSync(path1);
        var globalPersistentConfig = JSON.parse(globalPersistentConfigData);

        //Bot Setup
        bot.TOKEN = globalPersistentConfig.token;
        bot.start = new Date().getTime();
        bot.isDatabaseReady = false;
        bot.cmdArgs = process.argv.slice(2)[0].split(",");
        bot.isDeveloper = bot.cmdArgs.includes("-d");

        bot.pickRandom = array =>
            array[(Math.floor(Math.random() * array.length) + 1) - 1];
        bot.readJSON = path =>
            JSON.parse(bot.fs.readFileSync(process.cwd() + path))

        bot.onError = (channel, e) => {
            console.error(e);
            const embedError = {
                title: "<:n_error:771852301413384192> Error occured!",
                description: "```" + e.stack + "```"
            }
        
            //channel.send("", { embed: embedError });
        }

        //Load persistentConfig
        bot.globalPersistentConfig = bot.readJSON("/botData/config_persistent.json");

        //SQL Setup
        var conn = bot.sql.createConnection({
            host: "localhost",
            user: "root",
            password: bot.globalPersistentConfig.sqlPassword,
            database: (bot.isDeveloper === false ? "nekomaid_bot" : "nekomaid_bot_dev"),
            charset: 'utf8mb4'
        });

        conn.promise().connect()
        .then((res, err) => {
            if (err) { throw err; }
            console.log("Connected to SQL-");
        });

        //Modules Setup
        bot.ServerStructureManager = require('./scripts/data/server_structure_manager');
        bot.ssm = new bot.ServerStructureManager(bot, bot.sql, conn);

        bot.Rule34API = require('./scripts/apis/rule34_api');
        bot.r34 = new bot.Rule34API(bot.cheerio, bot.axios);

        bot.GelbooruAPI = require('./scripts/apis/gelbooru_api');
        bot.gelbooru = new bot.GelbooruAPI(bot.cheerio, bot.axios);

        bot.XBooruAPI = require('./scripts/apis/xbooru_api');
        bot.xbooru = new bot.XBooruAPI(bot.cheerio, bot.axios);

        bot.RealbooruAPI = require('./scripts/apis/realbooru_api');
        bot.realbooru = new bot.RealbooruAPI(bot.cheerio, bot.axios);

        bot.NHentaiAPI = require('./scripts/apis/nhentai_api');
        bot.nhentai = new bot.NHentaiAPI(bot.cheerio, bot.axios);

        bot.SafebooruAPI = require('./scripts/apis/safebooru_api');
        bot.safebooru = new bot.SafebooruAPI(bot.cheerio, bot.axios, bot.xmlconvert);

        bot.DanbooruAPI = require('./scripts/apis/danbooru_api');
        bot.danbooru = new bot.DanbooruAPI(bot.cheerio, bot.axios, bot.xmlconvert);

        bot.E621API = require('./scripts/apis/e621_api');
        bot.e621 = new bot.E621API(bot.cheerio, bot.axios, bot.xmlconvert);

        bot.TimeConvert = require('./scripts/utils/util_timeconvert');
        bot.tc = new bot.TimeConvert();

        bot.SortBy = require('./scripts/utils/util_sortby');
        bot.sb = new bot.SortBy();

        bot.LevelingManager = require('./scripts/modules/module_level_manager');
        bot.lvl = new bot.LevelingManager();

        bot.ModerationManager = require('./scripts/modules/module_moderation_manager');
        bot.moderator = new bot.ModerationManager(bot);

        bot.MarriageProposal = require('./scripts/helpers/marriage_proposal');
        bot.VoiceData = require('./scripts/helpers/voice_data');
        bot.VoiceRequest = require('./scripts/helpers/voice_request');

        bot.MarriageManager = require('./scripts/managers/marriage_manager');
        bot.mm = new bot.MarriageManager(bot);

        bot.VoiceManager = require('./scripts/managers/voice_manager');
        bot.vm = new bot.VoiceManager(bot);

        bot.UpvoteManager = require('./scripts/managers/upvote_manager');
        bot.um = new bot.UpvoteManager(bot);

        bot.SupportServerManager = require('./scripts/managers/supportserver_manager');
        bot.supm = new bot.SupportServerManager(bot);

        bot.CounterManager = require('./scripts/managers/counter_manager');
        bot.cm = new bot.CounterManager(bot);

        bot.ReactionRolesManager = require('./scripts/managers/rr_manager');
        bot.rrm = new bot.ReactionRolesManager(bot);

        bot.InventoryManager = require('./scripts/managers/inventory_manager');
        bot.im = new bot.InventoryManager(bot);

        bot.EventManager = require('./scripts/managers/event_manager');
        bot.em = new bot.EventManager(bot);

        bot.OsuAPI = require('node-osu');
        bot.osu = new bot.OsuAPI.Api(bot.globalPersistentConfig.osuAPI_key, { notFoundAsError: false, completeScores: true });

        bot.OsuAPI2 = require('./scripts/apis/osu_api');
        bot.osu2 = new bot.OsuAPI2(bot.cheerio, require('got'));

        bot.io = require('socket.io-client');
        bot.socketClient = bot.io("https://nekomaid.xyz");
        bot.socketClient.emit("login", { API_key: bot.globalPersistentConfig.nekoAPI_key })
        bot.socketClient.on("saveConfig", (data) => {
            console.log("Saving config of guild - " + data.guild.id);
            bot.ssm.server_edit.edit(bot.ssm, { type: "server", id: data.guild.id, server: data.guild.config });
        });
        bot.socketClient.on("getGuildDetailed", async(data, cb) => {
            //console.log("Retrieving details of guild - " + data.guild.id);
            
            let guild = await bot.guilds.fetch(data.guild.id).catch(e => { console.log(e); })
            if(guild === undefined) { cb({ status: -1 }); return; }
            let guildData = {
                channels: Array.from(guild.channels.cache.values()).reduce((acc, curr) => { acc.push({ id: curr.id, name: curr.name, type: curr.type }); return acc; }, []),
                roles: Array.from(guild.roles.cache.values()).reduce((acc, curr) => { acc.push({ id: curr.id, name: curr.name, position: curr.position, color: curr.hexColor, permissions: curr.permissions.bitfield }); return acc; }, [])
            }

            cb(guildData);
        });

        bot.webupdates = require('./scripts/webupdates/webupdates');

        bot.vars = require('./scripts/utils/util_vars');

        //Assign moduleArgs
        bot.processMessage = mainClass.processMessage;
        bot.totalEvents = 0;
        bot.processedEvents = 0;
        bot.totalMessages = 0;
        bot.processedMessages = 0;
        bot.totalCommands = 0;
        bot.processedCommands = 0;

        bot.lastModeratorIDs = new Map();
        bot.openings = bot.readJSON("/data/openings.json");

        bot.headers = {
            "Content-Type": 'application/json',
            "Authorization": bot.globalPersistentConfig.nekoAPI_key
        }

        let lastTimestamp = Date.now();
        bot.timer_00 = setInterval(
            () => {
                let date = new Date();
                if(date.getHours() % 2 === 0 && date.getMinutes() === 0 && Date.now() > (lastTimestamp + 1000*60)) {
                    bot.em.spawnEvent(bot.em, '820689825345699880');
                    lastTimestamp = Date.now();
                }
            },
        5000);
        console.log("Finished importing...");
    },

    async importIntoBot2(bot) {
        /*var snoo = await bot.snoowrap.fromApplicationOnlyAuth({
            userAgent: 'nekomaid-bot',
            clientId: 'QpyhOOeY0FsOGQ',
            clientSecret: bot.globalPersistentConfig.redditAPIKey,
            grantType: bot.snoowrap.grantType.CLIENT_CREDENTIALS
        })
        
        bot.osu2.snoo = snoo;*/
    }
}