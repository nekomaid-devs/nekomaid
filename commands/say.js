const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "say",
    category: "Utility",
    description: "Makes NekoMaid say something.",
    helpUsage: "[text]`",
    exampleUsage: "please i need help",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in what you want Nekomaid to say.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("me", "MANAGE_MESSAGES")
    ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        // TODO: disable this shit by default lmao
        if(command_data.server_config.say_command == false) {
            return;
        }
        if(command_data.msg.mentions.members.size > 0 || command_data.msg.mentions.roles.size > 0 || command_data.msg.mentions.everyone === true) {
            command_data.msg.reply("Please remove all mentions before trying again!");
            return;
        }
        if(command_data.msg.content.includes("@everyone") || command_data.msg.content.includes("@here")) {
            command_data.msg.reply("Please remove all mentions before trying again!");
            return;
        }

        command_data.msg.channel.send(command_data.total_argument).catch(e => { command_data.global_context.logger.api_error(e); });
        command_data.msg.delete().catch(e => { command_data.global_context.logger.api_error(e); });
    },
};