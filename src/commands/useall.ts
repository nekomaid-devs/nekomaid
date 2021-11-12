/* Types */
import { CommandData, Command, ItemData } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

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
        if (command_data.message.guild === null || command_data.bot_data.items === null || command_data.user_data.inventory === null) {
            return;
        }
        const item_name = command_data.total_argument;

        const target_item = command_data.bot_data.items.find((e) => {
            return e.display_name === item_name;
        });
        if (target_item === undefined) {
            command_data.message.reply(`Haven't found any item with name \`${item_name}\`.`);
            return;
        }

        const target_indexes: number[] = [];
        command_data.user_data.inventory.forEach((item, index) => {
            if (item.item_ID === target_item.id) {
                target_indexes.push(index);
            }
        });
        target_indexes.reverse();
        if (target_indexes.length < 1) {
            command_data.message.reply(`You don't have any items called \`${command_data.total_argument}\`.`);
            return;
        }

        command_data.global_context.neko_modules_clients.inventoryManager.use_item(command_data, target_item, target_indexes);
    },
} as Command;
