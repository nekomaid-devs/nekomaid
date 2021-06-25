const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "use",
    category: "Profile",
    description: "Uses an item, if possible-",
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

        //Resolve item
        var itemID = -1;
        var itemPrefab = -1;
        var targetIndex = -1;

        command_data.global_context.bot_config.items.forEach(item => {
            if(item.displayName.toLowerCase() === itemName.toLowerCase()) {
                itemID = item.id;
                itemPrefab = item;
            }
        });

        data.authorConfig.inventory.forEach(function(id, index) {
            if(id === itemID) {
                targetIndex = index;
            }
        });

        if(targetIndex === -1) {
            command_data.msg.reply("You don't have any item called `" + itemName + "`-");
            return;
        }

        data.bot.im.useItem(data.bot.im, data, itemPrefab, [ targetIndex ]);
    },
};