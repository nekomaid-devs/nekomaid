const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "buy",
    category: "Profile",
    description: "Buys an item-",
    helpUsage: "[item name]`",
    exampleUsage: "Bank Upgrade I",
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
            data.msg.reply("Haven't found any item with name `" + itemName + "`-");
            return;
        }

        var targetItem2 = -1;
        command_data.global_context.bot_config.shopItems.forEach(function (item2) {
            if(item2.id === targetItem.id) {
                targetItem2 = item2;
            }
        })

        if(targetItem2 === -1) {
            data.msg.reply("Item `" + targetItem.displayName + "` isn't for sale-");
            return;
        }

        if(data.authorConfig.credits < targetItem2.price) {
            data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        data.authorConfig.credits -= targetItem2.price;
        data.authorConfig.inventory.push(targetItem2.id)

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        let embedBuy = {
            color: 8388736,
            description: "Bought `1x " + targetItem.displayName + "` for `" + targetItem2.price + " 💵`-"
        }

        command_data.msg.channel.send("", { embed: embedBuy }).catch(e => { console.log(e); });
    },
};