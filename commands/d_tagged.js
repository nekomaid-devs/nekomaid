const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_tagged",
    category: "Testing",
    description: "Sends a message with stringified config of tagged user-",
    helpUsage: "[mention]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        command_data.msg.channel.send(JSON.stringify(command_data.tagged_user_config)).catch(e => { console.log(e); });
    },
};