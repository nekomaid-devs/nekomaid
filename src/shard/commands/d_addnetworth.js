const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_addnetworth",
    category: "Testing",
    description: "Adds net worth to tagged user.",
    helpUsage: "[mention] [amount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention"), new NeededArgument(2, "You need to type in an amount.", "int>0")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", "BOT_OWNER")],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let credits_amount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.tagged_user_config });

        command_data.msg.channel
            .send(
                `Added \`${command_data.global_context.utils.format_number(credits_amount)}\` net worth to \`${command_data.tagged_user.tag}\`! (Current net worth: \`${command_data.global_context.utils.format_number(
                    command_data.tagged_user_config.net_worth
                )}$\`)`
            )
            .catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
    },
};
