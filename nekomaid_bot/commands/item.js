const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'item',
    category: 'Profile',
    description: 'Displays info about an item-',
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
        var itemName = data.totalArgument;
        var targetItem = -1;

        data.botConfig.items.forEach(item => {
            if(item.displayName.toLowerCase() === itemName.toLowerCase()) {
                targetItem = item;
            }
        });

        if(targetItem === -1) {
            data.reply("Haven't found any item with name `" + itemName + "`-");
            return;
        }

        var embedItem = {
            color: 8388736,
            title: "Info about `" + targetItem.displayName + "`",
            description: targetItem.description,
            footer: "Requested by " + data.authorTag
        }

        data.channel.send("", { embed: embedItem }).catch(e => { console.log(e); });
    },
};