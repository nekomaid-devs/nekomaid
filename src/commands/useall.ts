/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "useall",
    category: "Profile",
    description: "Uses all items with name, if possible.",
    helpUsage: "[item name]`",
    exampleUsage: "Rare Box",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in an item name.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        // TODO: this needs to be refactored fr
        let item_name = command_data.total_argument;
        item_name = item_name.includes("<@") ? item_name.substring(0, item_name.indexOf("<@") - 1) : item_name;

        let item_ID = -1;
        let item_prefab = -1;
        const target_indexes: any[] = [];

        command_data.global_context.bot_config.items.forEach((item: any) => {
            if (item.display_name.toLowerCase() === item_name.toLowerCase()) {
                item_ID = item.id;
                item_prefab = item;
            }
        });

        command_data.author_user_config.inventory.forEach((item: any, index: number) => {
            if (item.item_ID === item_ID) {
                target_indexes.push(index);
            }
        });
        target_indexes.reverse();
        if (target_indexes.length < 1) {
            command_data.msg.reply(`You don't have any items called \`${item_name}\`-`);
            return;
        }

        command_data.global_context.neko_modules_clients.inventoryManager.use_item(command_data, item_prefab, target_indexes);
    },
};
