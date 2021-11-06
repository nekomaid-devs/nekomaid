/* Types */
import { CommandData, Command, ItemData } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_items } from "../scripts/utils/util_vars";

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

        let item_prefab: ItemData | null = null;
        get_items().forEach((item) => {
            if (item.display_name.toLowerCase() === command_data.total_argument.toLowerCase()) {
                item_prefab = item;
            }
        });
        if (item_prefab === null) {
            command_data.msg.reply(`No item with name \`${command_data.total_argument}\` exists.`);
            return;
        }

        const target_indexes: number[] = [];
        command_data.author_user_config.inventory.forEach((item, index) => {
            if (item_prefab === null) {
                return;
            }
            if (item.item_ID === item_prefab.item_ID) {
                target_indexes.push(index);
            }
        });
        target_indexes.reverse();
        if (target_indexes.length < 1) {
            command_data.msg.reply(`You don't have any items called \`${command_data.total_argument}\`.`);
            return;
        }

        command_data.global_context.neko_modules_clients.inventoryManager.use_item(command_data, item_prefab, target_indexes);
    },
} as Command;
