/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "buy",
    category: "Profile",
    description: "Buys an item.",
    helpUsage: "[item name]`",
    exampleUsage: "Bank Upgrade I",
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

        if (command_data.user_data.credits < target_item.price) {
            command_data.message.reply("You don't have enough credits to do this.");
            return;
        }

        command_data.user_data.credits -= target_item.price;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const item = { id: randomBytes(16).toString("hex"), user_ID: command_data.message.author.id, item_ID: target_item.id };
        command_data.global_context.neko_modules_clients.db.add_inventory_item(item);

        const embedBuy = {
            color: 8388736,
            description: `Bought \`1x ${target_item.display_name}\` for \`${format_number(target_item.price)} 💵\`.`,
        };
        command_data.message.channel.send({ embeds: [embedBuy] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
