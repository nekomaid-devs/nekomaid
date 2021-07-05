const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "someone",
    category: "Moderation",
    description: "Pings a random person on the server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MENTION_EVERYONE")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: this won't work
        let user = command_data.global_context.utils.pick_random(Array.from(command_data.msg.guild.members.cache.values()));
        command_data.msg.channel.send(`Pinged ${user}-`).catch(e => { console.log(e); });
    },
};