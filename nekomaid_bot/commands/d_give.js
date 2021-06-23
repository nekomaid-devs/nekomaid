const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_give',
    category: 'Testing',
    description: 'Adds an item to tagged user-',
    helpUsage: "[mention] [ammount] [itemID]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type mention somebody-", "mention1"),
        new NeededArgument(2, "You need to type in an ammount", "int>0"),
        new NeededArgument(3, "You need to type in an item ID-", "int")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(data) {
        var ammount = parseInt(data.args[1]);
        var itemID = parseInt(data.args[2]);

        var targetItem = data.botConfig.items.has(itemID) === true ? data.botConfig.items.get(itemID) : -1;
        if(targetItem === -1) {
            data.reply("There isn't any item with id `" + itemID + "`-");
            return;
        }

        //Add an item to a database
        for(var i = 0; i < ammount; i += 1) {
            data.taggedUserConfig.inventory.push({ id: itemID });
        }

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct message and send it
        console.log("[d_give] Added " + targetItem.displayName + " to " + data.taggedUserTag + " on Server(id: " + data.guild.id + ")");
        data.channel.send("Added `" + ammount + "x " + targetItem.displayName + "` to `" + data.taggedUserTag + "`-").catch(e => { console.log(e); });
    },
};