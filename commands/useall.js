const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "useall",
    category: "Profile",
    description: "Uses all items of name, if possible-",
    helpUsage: "[item name]`",
    exampleUsage: "Rare Box",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an item name-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.args.length < 1) {
            command_data.msg.reply(`You need to type in an item name-`);
            return;
        }

        //Resolve item name
        var itemName = command_data.total_argument;
        itemName = itemName.includes("<@") ? itemName.substring(0, itemName.indexOf("<@") - 1) : itemName;

        //Resolve items
        var itemID = -1;
        var itemPrefab = -1;
        var targetIndexes = [];

        command_data.global_context.bot_config.items.forEach(item => {
            if(item.displayName.toLowerCase() === itemName.toLowerCase()) {
                itemID = item.id;
                itemPrefab = item;
            }
        });

        data.authorConfig.inventory.forEach(function(id, index) {
            if(id === itemID) {
                targetIndexes.push(index);
            }
        });

        targetIndexes.reverse();

        if(targetIndexes.length < 1) {
            command_data.msg.reply("You don't have any items called `" + itemName + "`-");
            return;
        }

        data.bot.im.useItem(data.bot.im, data, itemPrefab, targetIndexes);
    },
};