//Create global context
let global_context = {
    bot: {},
    config: {},
    commands: new Map(),
    command_aliases: new Map(),
    data: {},

    modules: {},
    neko_modules: {},
    modules_clients: {},
    neko_modules_clients: {},

    utils: {},
    logger: {},
    bot_config: {},
    
    cached_all_channels: [],
    cached_all_roles: [],
    cached_all_members: []
}

//Import modules
const Discord = require("discord.js-light");
global_context.modules.Discord = Discord;
const fs = require("fs");
global_context.modules.fs = fs;
const { performance } = require('perf_hooks');
global_context.modules.performance = performance;

//Setup utils
global_context.utils.get_formatted_time = () => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    return (h < 10 ? "0" + h.toString() : h.toString()) + ":" + (m < 10 ? "0" + m.toString() : m.toString());
};
global_context.utils.read_JSON = (path) => {
    return JSON.parse(global_context.modules.fs.readFileSync(process.cwd() + path));
};

//Load default config
let config = global_context.utils.read_JSON("/configs/default.json");
global_context.config = config;

//Setup Discord client
const bot = new Discord.Client({
    cacheGuilds: true,
    cacheChannels: false,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false,
    messageCacheMaxSize: 10
});
global_context.bot = bot;
bot.neko_data = {};

//Create log colors
let log_colors = ["\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m",
                    "\x1b[90m", "\x1b[93m", "\x1b[95m", "\x1b[96m", "\x1b[97m"]
var log_color_shard = log_colors[Math.floor(Math.random() * log_colors.length)];
var log_color_message = "\x1b[92m";
var log_color_api_error = "\x1b[94m";
var log_color_error = "\x1b[31m";
var log_color_time = "\x1b[91m";

//Console setup
global_context.logger.log = (log_message) => {
    process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] " + log_color_shard + "[shard_" + bot.shard.ids[0] + "] " + log_color_message + log_message + "\x1b[0m\n");
};
global_context.logger.api_error = (error) => {
    var log_message = error.stack === undefined ? error : error.stack;
    process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] [API Error] " + log_color_shard + "[shard_" + bot.shard.ids[0] + "] " + log_color_api_error + log_message + "\x1b[0m\n");
};
global_context.logger.error = (error) => {
    var log_message = error.stack === undefined ? error : error.stack;
    process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] [Error] " + log_color_shard + "[shard_" + bot.shard.ids[0] + "] " + log_color_error + log_message + "\x1b[0m\n");
};
global_context.logger.log("Started logging into the shard...");
let t_loading_start = global_context.modules.performance.now();

//Setup commands
let bot_commands = require('./commands');
Object.keys(bot_commands).forEach(key => {
    global_context.commands.set(bot_commands[key].name, bot_commands[key]);
});

//Setup command aliases
global_context.commands.forEach(command => {
    command.aliases.forEach(alias => {
        global_context.command_aliases.set(alias, command.name);
    });
});

//Log into Discord
bot.login(global_context.config.token);

/*bot.top = []
setInterval(async function() {
    if(bot.shard.ids[0] !== bot.Discord.ShardClientUtil.shardIDForGuildID("713467608363696128", bot.shard.count)) { return; }
    let topList = await bot.sb.get_top(bot, ["credits", "bank"]);
    bot.top = [];

    for(let i = 0; i < (topList.items.length < 15 ? topList.items.length : 15); i++) {
        var user = await bot.users.fetch(topList.items[i].userID).catch(e => { console.log(e); });
        bot.top.push({ username: user.username, credits: (topList.items[i].credits + topList.items[i].bank) });
    }
}, 60000)

async function postLoad() {
    bot.isDatabaseReady = true;

    bot.webupdates.refreshStatus(bot);
    bot.rrm.createCollectors(bot.rrm);

    bot.botConfig = await bot.ssm.server_fetch.fetch(bot, { type: "config", id: "defaultConfig" });
}*/
setInterval(() => {
    bot.neko_data.processed_events = global_context.data.processed_events;
    bot.neko_data.total_events = global_context.data.total_events;
    bot.neko_data.processed_messages = global_context.data.processed_messages;
    bot.neko_data.total_messages = global_context.data.total_messages;
    bot.neko_data.processed_commands = global_context.data.processed_commands;
    bot.neko_data.total_commands = global_context.data.total_commands;
    if(global_context.neko_modules_clients.vm !== undefined) {
        bot.neko_data.vm_connections = global_context.neko_modules_clients.vm.connections.size;
    }

    global_context.data.processed_events = 0;
    global_context.data.processed_messages = 0;
    global_context.data.processed_commands = 0;
}, 1000);
setInterval(() => {
    if(bot.shard.ids[0] !== 0) { return; }
    if(global_context.neko_modules.web_updates !== undefined) {
        global_context.neko_modules.web_updates.refresh_website(global_context);
    }
}, 2000);
setInterval(() => {
    global_context.neko_modules.web_updates.refresh_bot_list(global_context);
}, 60000);
setInterval(() => {
    global_context.neko_modules.web_updates.refresh_status(global_context);
}, 60000 * 30);

let bot_importer = require('./bot_importer');
bot.on('ready', async() => {
    let t_logging_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished logging into the shard (took ${(t_logging_end - t_loading_start).toFixed(1)}ms)...`);
    global_context.logger.log("-".repeat(30));

    //Stuff the bot with goods uwu :pleading_emoji:
    global_context.logger.log(`Started loading the shard...`);
    global_context = await bot_importer.import_into_context(global_context);
    bot.neko_data.uptime_start = global_context.data.uptime_start;

    let t_loading_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished loading shard (took ${(t_loading_end - t_logging_end).toFixed(1)}ms)...`);
    global_context.logger.log("-".repeat(30));
    global_context.logger.log(`[Guilds: ${bot.guilds.cache.size}] - [Channels: ${bot.channels.cache.size}] - [Users: ${bot.users.cache.size}]`);

    global_context.bot_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "config", id: "defaultConfig" });
    global_context.neko_modules.web_updates.refresh_status(global_context);
    
    let bot_callbacks = require('./callbacks');
    Object.keys(bot_callbacks).forEach(key => {
        bot_callbacks[key].hook(global_context);
    });
});
bot.on('ratelimit', (ratelimit) => {
    global_context.logger.log("Ratelimit: " + ratelimit.timeout + " (" + ratelimit.path + " - " + ratelimit.route + ")");
});