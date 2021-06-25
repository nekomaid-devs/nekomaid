const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "item",
    category: "Profile",
    description: "Displays info about an item-",
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
        var itemName = command_data.total_argument;
        var targetItem = -1;

        command_data.global_context.bot_config.items.forEach(item => {
            if(item.displayName.toLowerCase() === itemName.toLowerCase()) {
                targetItem = item;
            }
        });

        if(targetItem === -1) {
            command_data.msg.reply("Haven't found any item with name `" + itemName + "`-");
            return;
        }

        let embedItem = {
            color: 8388736,
            title: "Info about `" + targetItem.displayName + "`",
            description: targetItem.description,
            footer: "Requested by " + command_data.msg.author.tag
        }

        command_data.msg.channel.send("", { embed: embedItem }).catch(e => { console.log(e); });
    },
};