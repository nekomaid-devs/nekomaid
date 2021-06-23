const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_addnetworth',
    category: 'Testing',
    description: 'Adds net worth to tagged user-',
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
    execute(data) {
        var creditsAmmount = parseInt(data.args[1]);
        data.taggedUserConfig.netWorth += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct message and send it
        data.channel.send("Added `" + creditsAmmount + "` net worth to `" + data.taggedUserTag + "`! (Current net worth: `" + data.taggedUserConfig.netWorth + "$`)").catch(e => { console.log(e); });
    },
};