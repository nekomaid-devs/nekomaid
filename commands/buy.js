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
        let item_name = command_data.total_argument;
        let target_item = -1;
        command_data.global_context.bot_config.items.forEach(item => {
            if(item.displayName.toLowerCase() === item_name.toLowerCase()) {
                target_item = item;
            }
        });
        if(target_item === -1) {
            command_data.msg.reply(`Haven't found any item with name \`${item_name}\`-`);
            return;
        }

        let target_shop_item = -1;
        command_data.global_context.bot_config.shopItems.forEach(item => {
            if(item.id === target_item.id) {
                target_shop_item = item;
            }
        })
        if(target_shop_item === -1) {
            command_data.msg.reply(`Item \`${target_item.displayName}\` isn't for sale-`);
            return;
        }

        if(command_data.author_config.credits < target_shop_item.price) {
            command_data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        command_data.author_config.credits -= target_shop_item.price;
        command_data.author_config.inventory.push(target_shop_item.id);
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedBuy = {
            color: 8388736,
            description: `Bought \`1x ${target_item.displayName}\` for \`${target_shop_item.price} 💵\`-`
        }
        command_data.msg.channel.send("", { embed: embedBuy }).catch(e => { console.log(e); });
    },
};