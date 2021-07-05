const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "slowmode",
    category: "Moderation",
    description: "Set a slowmode for current channel.",
    helpUsage: "[seconds]`",
    exampleUsage: "10",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in number of seconds.", "int>0")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_CHANNELS"),
        new NeededPermission("me", "MANAGE_CHANNELS"),
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: add an option for "off/on" (and remember last slowmode)
        let time = parseInt(command_data.args[0]);
        command_data.msg.channel.setRateLimitPerUser(time);
        command_data.msg.channel.send(`Set current channel's slowmode to \`${time}\` s.`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};