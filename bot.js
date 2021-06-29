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
    bot_config: { botOwners: [] }
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
    cacheChannels: true,
    cacheOverwrites: true,
    cacheRoles: true,
    cacheEmojis: true,
    cachePresences: false
});
global_context.bot = bot;

//Create log colors
let log_colors = ["\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m",
                            "\x1b[90m", "\x1b[92m", "\x1b[93m", "\x1b[95m", "\x1b[96m"]
var log_color_shard = log_colors[Math.floor(Math.random() * log_colors.length)];
var log_color_message = "\x1b[92m";
var log_color_time = "\x1b[91m";

//Console setup
global_context.logger.log = (log_message) => {
    process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] " + log_color_shard + "[shard_" + bot.shard.ids[0] + "] " + log_color_message + log_message + "\x1b[0m\n");
};
global_context.logger.error = (error) => {
    var log_message = error.stack === undefined ? error : error.stack;
    process.stdout.write(log_color_time + "[" + global_context.utils.get_formatted_time() + "] " + log_color_shard + "[shard_" + bot.shard.ids[0] + "] " + log_color_message + log_message + "\x1b[0m\n");
};
global_context.logger.log(`Started loading shard...`);
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

//Setup callbacks
let bot_callbacks = require('./callbacks');
Object.keys(bot_callbacks).forEach(key => {
    bot_callbacks[key].hook(global_context);
});

//Log into Discord
bot.login(global_context.config.token);

/*bot.top = []
setInterval(function() {
    if(bot.shard.ids[0] !== bot.Discord.ShardClientUtil.shardIDForGuildID("713467608363696128", bot.shard.count)) { return; }
    bot.webupdates.refreshWebsite(bot);

    bot.processedEvents = 0;
    bot.processedMessages = 0;
    bot.processedCommands = 0;
}, 1000)
setInterval(async function() {
    if(bot.shard.ids[0] !== bot.Discord.ShardClientUtil.shardIDForGuildID("713467608363696128", bot.shard.count)) { return; }
    let topList = await bot.sb.updateTop(bot, ["credits", "bank"]);
    bot.top = [];

    for(let i = 0; i < (topList.items.length < 15 ? topList.items.length : 15); i++) {
        var user = await bot.users.fetch(topList.items[i].userID).catch(e => { console.log(e); });
        bot.top.push({ username: user.username, credits: (topList.items[i].credits + topList.items[i].bank) });
    }
}, 60000)

setInterval(function() {
    if(bot.shard.ids[0] !== bot.Discord.ShardClientUtil.shardIDForGuildID("713467608363696128", bot.shard.count)) { return; }
    
    bot.webupdates.refreshStatus(bot);
    bot.webupdates.refreshBotList(bot);
}, 60000)

async function postLoad() {
    bot.isDatabaseReady = true;

    bot.webupdates.refreshStatus(bot);
    bot.rrm.createCollectors(bot.rrm);

    bot.botConfig = await bot.ssm.server_fetch.fetch(bot, { type: "config", id: "defaultConfig" });
}*/

let bot_importer = require('./bot_importer');
bot.on('ready', async() => {
    let t_logging_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished logging into shard (took ${(t_logging_end - t_loading_start).toFixed(1)}ms)...`);

    //Stuff the bot with goods uwu :pleading_emoji:
    global_context = await bot_importer.import_into_context(global_context);

    let t_loading_end = global_context.modules.performance.now();
    global_context.logger.log(`Finished loading shard (took ${(t_loading_end - t_logging_end).toFixed(1)}ms)...`);
    global_context.logger.log(`[Guilds: ${bot.guilds.cache.size}] - [Users: ${bot.users.cache.size}] - [Channels: ${bot.channels.cache.size}]`);

    bot.user.setStatus('available');
    bot.user.setActivity("getting bullied by lamkas", { type: 'PLAYING' });

    /*bot.webupdates.refreshStatus(bot);
    console.log("Preparing the database...");
    setTimeout(postLoad, 1000);*/
});
bot.on('ratelimit', (ratelimit) => {
    global_context.logger.log("Ratelimit: " + ratelimit.timeout + " (" + ratelimit.path + " - " + ratelimit.route + ")");
});