const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_setbank",
    category: "Testing",
    description: "Sets bank to tagged user.",
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
    cooldown: 1500,
    async execute(command_data) {
        if(command_data.msg.mentions.users.size < 1) {
            command_data.tagged_user = await command_data.global_context.bot.users.fetch(command_data.args[0]).catch(e => { command_data.global_context.logger.api_error(e); });
            command_data.tagged_user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "global_user", id: command_data.args[0] });    
        }

        let credits_ammount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.bank = credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.tagged_user_config });
    
        command_data.msg.channel.send(`Set bank to \`${command_data.global_context.utils.format_number(credits_ammount)}\` for \`${command_data.tagged_user.tag}\`!`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};