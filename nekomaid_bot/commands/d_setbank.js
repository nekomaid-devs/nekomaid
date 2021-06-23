const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_setbank',
    category: 'Testing',
    description: 'Sets bank to tagged user-',
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
    async execute(data) {
        if(data.msg.mentions.users.size < 1) {
            data.taggedUser = await data.bot.users.fetch(data.args[0]).catch(e => { console.log(e); });
            data.taggedUserTag = data.taggedUser.tag;
            data.taggedUserConfig = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "globalUser", id: data.args[0] });    
        }

        var creditsAmmount = parseInt(data.args[1]);
        data.taggedUserConfig.bank = creditsAmmount;
    
        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });
    
        //Construct message and send it
        data.channel.send("Set bank to `" + creditsAmmount + "` for `" + data.taggedUserTag + "`!").catch(e => { console.log(e); });
    },
};