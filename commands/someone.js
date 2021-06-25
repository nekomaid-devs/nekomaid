const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "someone",
    category: "Moderation",
    description: "Pings a random person on the server-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MENTION_EVERYONE")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Get a random user
        var users = command_data.msg.guild.members.cache;
        var user = command_data.global_context.utils.pick_random(Array.from(users.values()));

        //Process message
        console.log(`[someone] Pinging ${user.displayName}...`);
        command_data.msg.channel.send(`Pinged ${user}-`).catch(e => { console.log(e); });
    },
};