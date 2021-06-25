const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_giveinserver",
    category: "Testing",
    description: "Adds an item to all users in a server-",
    helpUsage: "[ammount] [itemID]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount", "int>0"),
        new NeededArgument(2, "You need to type in an item ID-", "int")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var ammount = parseInt(command_data.args[0]);
        var itemID = parseInt(command_data.args[1]);

        var targetItem = command_data.global_context.bot_config.items.has(itemID) === true ? command_data.global_context.bot_config.items.get(itemID) : -1;
        if(targetItem === -1) {
            command_data.msg.reply("There isn't any item with id `" + itemID + "`-");
            return;
        }

        command_data.msg.guild.members.cache.forEach(member => {
            //Add an item to a database
            var globalUserConfig = data.bot.ssm.globalUserConfigCache.get(member.id);
            for(var i = 0; i < ammount; i += 1) {
                globalUserConfig.inventory.push({ id: itemID });
            }

            //Edits and broadcasts the change
            data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: member.id, user: globalUserConfig });
        });

        //Construct message and send it
        console.log("[d_giveinserver] Added " + targetItem.displayName + " to " + command_data.msg.guild.members.cache.size + " members on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("Added `" + ammount + "x " + targetItem.displayName + "` to `" + command_data.msg.guild.members.cache.size + "` members-").catch(e => { console.log(e); });
    },
};