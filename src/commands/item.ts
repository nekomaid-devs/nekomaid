/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "item",
    category: "Profile",
    description: "Displays info about an item.",
    helpUsage: "[item_name]`",
    exampleUsage: "Rare Box",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an item name.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.bot_data.items === null) {
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

        const embedItem = {
            color: 8388736,
            title: `Item - ${target_item.display_name}`,
            description: target_item.description,
            footer: { text: `Requested by ${command_data.message.author.tag}` },
        };
        command_data.message.channel.send({ embeds: [embedItem] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
