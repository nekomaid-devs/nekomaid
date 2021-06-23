const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'use',
    category: 'Profile',
    description: 'Uses an item, if possible-',
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
    execute(data) {
        if(data.args.length < 1) {
            data.reply(`You need to type in an item name-`);
            return;
        }

        //Resolve item name
        var itemName = data.totalArgument;
        itemName = itemName.includes("<@") ? itemName.substring(0, itemName.indexOf("<@") - 1) : itemName;

        //Resolve item
        var itemID = -1;
        var itemPrefab = -1;
        var targetIndex = -1;

        data.botConfig.items.forEach(item => {
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
            data.reply("You don't have any item called `" + itemName + "`-");
            return;
        }

        data.bot.im.useItem(data.bot.im, data, itemPrefab, [ targetIndex ]);
    },
};