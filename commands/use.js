const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "use",
    category: "Profile",
    description: "Uses an item with name, if possible.",
    helpUsage: "[item name]`",
    exampleUsage: "Rare Box",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an item name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: add support for number of items
        // TODO: this needs to be refactored fr
        let item_name = command_data.total_argument;
        item_name = item_name.includes("<@") ? item_name.substring(0, item_name.indexOf("<@") - 1) : item_name;

        let item_ID = -1;
        let item_prefab = -1;
        let target_index = -1;

        command_data.global_context.bot_config.items.forEach(item => {
            if(item.display_name.toLowerCase() === item_name.toLowerCase()) {
                item_ID = item.id;
                item_prefab = item;
            }
        });

        command_data.author_config.inventory.forEach((item, index) => {
            if(item.item_ID === item_ID) {
                target_index = index;
            }
        });
        if(target_index === -1) {
            command_data.msg.reply(`You don't have any item called \`${item_name}\`-`);
            return;
        }

        command_data.global_context.neko_modules_clients.im.use_item(command_data, item_prefab, [ target_index ]);
    },
};