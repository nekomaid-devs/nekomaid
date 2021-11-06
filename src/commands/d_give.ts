/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";
import { get_items } from "../scripts/utils/util_vars";

export default {
    name: "d_give",
    category: "Testing",
    description: "Adds an item to tagged user.",
    helpUsage: "[mention] [amount] [itemID]`",
    exampleUsage: "/user_tag/ 1 0",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to type mention somebody.", "mention"), new NeededArgument(2, "You need to type in an amount.", "int>0"), new NeededArgument(3, "You need to type in an item ID.", "int") ],
    argumentsRecommended: [],
    permissionsNeeded: [ new NeededPermission("author", ExtraPermission.BOT_OWNER) ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        const amount = parseInt(command_data.args[1]);
        const item_ID = command_data.args[2];

        const target_item = get_items().get(item_ID);
        if (target_item === undefined) {
            command_data.msg.reply(`There isn't any item with id \`${item_ID}\`.`);
            return;
        }

        for (let i = 0; i < amount; i++) {
            const item = { id: randomBytes(16).toString("hex"), user_ID: command_data.tagged_user.id, item_ID: item_ID };
            command_data.global_context.neko_modules_clients.db.add_inventory_item(item);
        }

        command_data.msg.channel.send(`Added \`${amount}x ${target_item.display_name}\` to \`${command_data.tagged_user.tag}\`!`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
