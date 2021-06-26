const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_addnetworth",
    category: "Testing",
    description: "Adds net worth to tagged user-",
    helpUsage: "[mention] [ammount]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1"),
        new NeededArgument(2, "You need to type in an ammount-", "int>0")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var creditsAmmount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.netWorth += creditsAmmount;

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct message and send it
        command_data.msg.channel.send("Added `" + creditsAmmount + "` net worth to `" + command_data.tagged_user.tag + "`! (Current net worth: `" + command_data.tagged_user_config.netWorth + "$`)").catch(e => { console.log(e); });
    },
};