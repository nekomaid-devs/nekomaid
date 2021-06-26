const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_give",
    category: "Testing",
    description: "Adds an item to tagged user-",
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
    execute(command_data) {
        // TODO: re-factor command
        var ammount = parseInt(command_data.args[1]);
        var itemID = parseInt(command_data.args[2]);

        var targetItem = command_data.global_context.bot_config.items.has(itemID) === true ? command_data.global_context.bot_config.items.get(itemID) : -1;
        if(targetItem === -1) {
            command_data.msg.reply("There isn't any item with id `" + itemID + "`-");
            return;
        }

        //Add an item to a database
        for(var i = 0; i < ammount; i += 1) {
            command_data.tagged_user_config.inventory.push({ id: itemID });
        }

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct message and send it
        console.log("[d_give] Added " + targetItem.displayName + " to " + command_data.tagged_user.tag + " on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("Added `" + ammount + "x " + targetItem.displayName + "` to `" + command_data.tagged_user.tag + "`-").catch(e => { console.log(e); });
    },
};