const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_setcredits",
    category: "Testing",
    description: "Sets credits to tagged user-",
    helpUsage: "[mention] [ammount]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        //new NeededArgument(1, "You need to mention somebody-", "mention1"),
        new NeededArgument(2, "You need to type in an ammount-", "int>0")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    async execute(command_data) {
        if(command_data.msg.mentions.users.size < 1) {
            command_data.tagged_user = await command_data.bot.users.fetch(command_data.args[0]).catch(e => { console.log(e); });
            command_data.tagged_user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "globalUser", id: command_data.args[0] });    
        }

        let credits_ammount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.credits = credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });
    
        command_data.msg.channel.send(`Set credits to \`${credits_ammount}\` for \`${command_data.tagged_user.tag}\`!`).catch(e => { console.log(e); });
    },
};