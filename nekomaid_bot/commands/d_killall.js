const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_killall',
    category: 'Testing',
    description: 'Kills all shards-',
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    async execute(data) {
        await data.channel.send("Killing all " + data.bot.shard.count + " shards...").catch(e => { console.log(e); });
        data.bot.shard.respawnAll();
    },
};