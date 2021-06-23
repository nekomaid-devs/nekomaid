const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_addcredits',
    category: 'Testing',
    description: 'Adds credits to tagged user-',
    helpUsage: "[mention] [ammount]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount-", "int>0")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(data) {
        var creditsAmmount = parseInt(data.args[1]);
        data.taggedUserConfig.credits += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct message and send it
        data.channel.send("Added `" + creditsAmmount + "` credits to `" + data.taggedUserTag + "`! (Current Credits: `" + data.taggedUserConfig.credits + "$`)").catch(e => { console.log(e); });
    },
};