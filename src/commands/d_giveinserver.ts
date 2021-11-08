/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import { get_items } from "../scripts/utils/util_vars";

export default {
    name: "d_giveinserver",
    category: "Testing",
    description: "Adds an item to all users in a server.",
    helpUsage: "[amount] [itemID]`",
    exampleUsage: "",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an amount.", "int>0", true), new Argument(2, "You need to type in an item ID.", "int", true)],
    permissions: [new Permission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.bot_data === null) {
            return;
        }
        const amount = parseInt(command_data.args[0]);
        const item_ID = command_data.args[1];
        const target_item = Array.from(get_items().values()).find((e) => {
            return e.id === item_ID;
        });

        if (target_item === undefined) {
            command_data.message.reply(`There isn't any item with id \`${item_ID}\`.`);
            return;
        }

        command_data.message.guild.members.cache.forEach((member) => {
            const item = { id: randomBytes(16).toString("hex"), user_ID: member.user.id, item_ID: item_ID };
            command_data.global_context.neko_modules_clients.db.add_inventory_item(item);
        });

        command_data.message.channel.send(`Added \`${amount}x ${target_item.display_name}\` to \`${command_data.message.guild.members.cache.size}\` members!`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
