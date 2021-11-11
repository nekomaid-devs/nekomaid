/* Types */
import { CommandData, Command, ItemData } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
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
    arguments: [new Argument(1, "You need to type in an item name.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.bot_data === null) {
            return;
        }

        let item_prefab: ItemData | null = null;
        get_items().forEach((item) => {
            if (item.display_name.toLowerCase() === command_data.total_argument.toLowerCase()) {
                item_prefab = item;
            }
        });
        if (item_prefab === null) {
            command_data.message.reply(`No item with name \`${command_data.total_argument}\` exists.`);
            return;
        }

        const target_indexes: number[] = [];
        command_data.user_data.inventory.forEach((item, index) => {
            if (item_prefab === null) {
                return;
            }
            if (item.item_ID === item_prefab.id) {
                target_indexes.push(index);
            }
        });
        target_indexes.reverse();
        if (target_indexes.length < 1) {
            command_data.message.reply(`You don't have any items called \`${command_data.total_argument}\`.`);
            return;
        }

        command_data.global_context.neko_modules_clients.inventoryManager.use_item(command_data, item_prefab, target_indexes);
    },
} as Command;
