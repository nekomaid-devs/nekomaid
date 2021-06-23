const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'someone',
    category: 'Moderation',
    description: 'Pings a random person on the server-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MENTION_EVERYONE")
    ],
    nsfw: false,
    execute(data) {
        //Get a random user
        var users = data.guild.members.cache;
        var user = data.bot.pickRandom(Array.from(users.values()));

        //Process message
        console.log(`[someone] Pinging ${user.displayName}...`);
        data.channel.send(`Pinged ${user}-`).catch(e => { console.log(e); });
    },
};