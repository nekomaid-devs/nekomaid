const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "buy",
    category: "Profile",
    description: "Buys an item.",
    helpUsage: "[item name]`",
    exampleUsage: "Bank Upgrade I",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an item name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let item_name = command_data.total_argument;
        let target_item = Array.from(command_data.global_context.bot_config.items.values()).find(e => { return e.display_name.toLowerCase() === item_name.toLowerCase(); });
        if(target_item === undefined) {
            command_data.msg.reply(`Haven't found any item with name \`${item_name}\`.`);
            return;
        }

        let target_shop_item = Array.from(command_data.global_context.bot_config.shopItems.values()).find(e => { return e.id === target_item.id; });
        if(target_shop_item === undefined) {
            command_data.msg.reply(`Item \`${target_item.display_name}\` isn't for sale.`);
            return;
        }

        if(command_data.author_config.credits < target_shop_item.price) {
            command_data.msg.reply(`You don't have enough credits to do this.`);
            return;
        }

        command_data.author_config.credits -= target_shop_item.price;
        command_data.author_config.inventory.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: command_data.msg.author.id, item_ID: target_shop_item.id });
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedBuy = {
            color: 8388736,
            description: `Bought \`1x ${target_item.display_name}\` for \`${command_data.global_context.utils.format_number(target_shop_item.price)} 💵\`.`
        }
        command_data.msg.channel.send("", { embed: embedBuy }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};