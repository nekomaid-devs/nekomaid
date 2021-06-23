//Create logColor
var colors = ["\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m",
                            "\x1b[90m", "\x1b[92m", "\x1b[93m", "\x1b[95m", "\x1b[96m"]

var numOfColors = colors.length;
var colorNumber = Math.floor(Math.random() * numOfColors) + 1;
var color = colors[colorNumber - 1];
var logColor = color;
var logColor2 = "\x1b[92m";
var logColor3 = "\x1b[91m";

//Discord Setup
const Discord = require('discord.js-light');
const bot = new Discord.Client({
    cacheGuilds: true,
    cacheChannels: true,
    cacheOverwrites: true,
    cacheRoles: true,
    cacheEmojis: true,
    cachePresences: false
});

bot.Discord = Discord;
bot.getDateTime = () => {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();

    return (h < 10 ? "0" + h.toString() : h.toString()) + ":" + (m < 10 ? "0" + m.toString() : m.toString());
}

//Console setup
bot.logs = []

console.log = function(text) {
    var logMessage = text;
    process.stdout.write(logColor3 + "[" + bot.getDateTime() + "] " + logColor + "[shard_" + bot.shard.ids[0] + "] " + logColor2 + logMessage + '\x1b[0m\n');

    bot.logs.push(logMessage);
    if(bot.webupdates !== undefined) {
        bot.webupdates.sendLogServer(bot, { message: "[shard_" + bot.shard.ids[0] + "] <> " + logMessage, type: 0, shard: bot.shard.ids[0] });
    }
};

console.error = function(error) {
    process.stdout.write(logColor + '>\x1b[0m\n');

    var logMessage = error.stack === undefined ? error : error.stack;
    process.stdout.write(logColor + "[shard_" + bot.shard.ids[0] + "] <> " + logMessage + '\x1b[0m\n');

    if(logMessage.length < 1) {
        return;
    }

    bot.logs.push(logMessage);
    if(bot.webupdates !== undefined) {
        bot.webupdates.sendLogServer(bot, { message: "[shard_" + bot.shard.ids[0] + "] <> " + logMessage, type: 1, shard: bot.shard.ids[0] });
    }
};

console.log("Loading shard with ID " + bot.shard.ids[0] + "...");

//Prepare commands into map
bot.commands = new Discord.Collection();
var botCommands = require('./commands');

Object.keys(botCommands).forEach(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.aliases = new Map();
bot.commands.forEach(function(command) {
    command.aliases.forEach(function(alias) {
        bot.aliases.set(alias, command.name);
    })
})

//Imports setup
var bot_importer = require('./bot_importer')
bot_importer.importIntoBot(bot, this)

//Callbacks setup
var guild_add = require('./scripts/callbacks/guild_add');
var guild_remove = require('./scripts/callbacks/guild_remove');
var guild_banadd = require('./scripts/callbacks/guild_banadd');
var guild_banremove = require('./scripts/callbacks/guild_banremove');
var guildmember_add = require('./scripts/callbacks/guildmember_add');
var guildmember_remove = require('./scripts/callbacks/guildmember_remove');
var guildmember_update = require('./scripts/callbacks/guildmember_update');
var nickname_change = require('./scripts/callbacks/guildmember_nicknamechange');
var channel_create = require('./scripts/callbacks/channel_create');
var channel_delete = require('./scripts/callbacks/channel_delete');
var channel_update = require('./scripts/callbacks/channel_update');
var role_create = require('./scripts/callbacks/role_create');
var role_delete = require('./scripts/callbacks/role_delete');
var role_update = require('./scripts/callbacks/role_update');
var message = require('./scripts/callbacks/message');
var message_delete = require('./scripts/callbacks/message_delete');
var message_update = require('./scripts/callbacks/message_update');
var reaction_add = require('./scripts/callbacks/reaction_add');

bot.processMessage = message.processMessage;

guild_add.hook(bot);
guild_remove.hook(bot)
guild_banadd.hook(bot);
guild_banremove.hook(bot);
guildmember_add.hook(bot);
guildmember_remove.hook(bot);
guildmember_update.hook(bot);
nickname_change.hook(bot);
channel_create.hook(bot);
channel_delete.hook(bot);
channel_update.hook(bot);
role_create.hook(bot);
role_delete.hook(bot);
role_update.hook(bot);
message.hook(bot);
message_delete.hook(bot);
message_update.hook(bot);
reaction_add.hook(bot);

//Log into bot
console.log("Logging in...");
bot.login(bot.TOKEN);

bot.top = []
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
}

bot.on('ready', () => {
    //Refresh status
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.webupdates.refreshStatus(bot);

    //Database Setup
    console.log("Preparing the database...");
    setTimeout(postLoad, 1000);
});
bot.on('ratelimit', (ratelimit) => {
    console.log("Ratelimit: " + ratelimit.timeout + " (" + ratelimit.path + " - " + ratelimit.route + ")");
})