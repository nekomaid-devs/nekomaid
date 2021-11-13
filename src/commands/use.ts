/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "use",
    category: "Profile",
    description: "Uses an item with name, if possible.",
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
        const item_name = command_data.total_argument.toLowerCase();

        const target_item = command_data.bot_data.items.find((e) => {
            return e.display_name.toLowerCase() === item_name;
        });
        if (target_item === undefined) {
            command_data.message.reply(`Haven't found any item with name \`${item_name}\`.`);
            return;
        }

        let target_index: number | null = null;
        command_data.user_data.inventory.forEach((item, index) => {
            if (item.item_ID === target_item.id) {
                target_index = index;
            }
        });
        if (target_index === null) {
            command_data.message.reply(`You don't have any item called \`${command_data.total_argument}\`.`);
            return;
        }

        command_data.global_context.neko_modules_clients.inventoryManager.use_item(command_data, target_item, [target_index]);
    },
} as Command;
