const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "owoify",
    category: "Fun",
    description: "Makes NekoMaid say something with a lot of uwus and owos (/-\\).",
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
    async execute(command_data) {
        if(command_data.server_config.sayCommand == false) {
            return;
        }
        if(command_data.args.length < 1) {
            command_data.msg.reply("You need to type in what do you me to owoify-");
            return;
        }
        if(command_data.msg.mentions.members.size > 0 || command_data.msg.mentions.roles.size > 0 || command_data.msg.mentions.everyone === true) {
            command_data.msg.reply("Please remove all mentions before trying again-");
            return;
        }
        if(command_data.msg.content.includes("@everyone") || command_data.msg.content.includes("@here")) {
            command_data.msg.reply("Please remove all mentions before trying again-");
            return;
        }

        let owoified_text = await command_data.global_context.modules_clients.neko.sfw.OwOify({ text: command_data.total_argument });
        command_data.msg.channel.send(owoified_text.owo).catch(e => { command_data.global_context.logger.api_error(e); });
        command_data.msg.delete().catch(e => { command_data.global_context.logger.api_error(e); });
    },
};