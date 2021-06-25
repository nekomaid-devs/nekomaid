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
        // TODO: re-factor command
        if(data.msg.mentions.users.size < 1) {
            command_data.tagged_user = await data.bot.users.fetch(command_data.args[0]).catch(e => { console.log(e); });
            command_data.tagged_user.tag = command_data.tagged_user.tag;
            command_data.tagged_user_config = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "globalUser", id: command_data.args[0] });    
        }

        var creditsAmmount = parseInt(command_data.args[1]);
        command_data.tagged_user_config.credits = creditsAmmount;
    
        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });
    
        //Construct message and send it
        command_data.msg.channel.send("Set credits to `" + creditsAmmount + "` for `" + command_data.tagged_user.tag + "`!").catch(e => { console.log(e); });
    },
};