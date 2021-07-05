const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_addbank",
    category: "Testing",
    description: "Adds bank to tagged user.",
    helpUsage: "[mention] [ammount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention"),
        new NeededArgument(2, "You need to type in an ammount.", "int>0")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        let credits_ammount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.bank += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        command_data.msg.channel.send(`Added \`${credits_ammount}\` bank to \`${command_data.tagged_user.tag}\`! (Current bank: \`${command_data.tagged_user_config.bank}$\`)`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};