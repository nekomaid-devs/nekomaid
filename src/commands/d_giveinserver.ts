/* Types */
import { CommandData, ExtraPermission } from "../ts/types";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "d_giveinserver",
    category: "Testing",
    description: "Adds an item to all users in a server.",
    helpUsage: "[amount] [itemID]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in an amount.", "int>0"), new NeededArgument(2, "You need to type in an item ID.", "int")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        const amount = parseInt(command_data.args[0]);
        const item_ID = command_data.args[1];
        const target_item: any = Array.from(command_data.global_context.bot_config.items.values()).find((e: any) => {
            return e.id === item_ID;
        });

        if (target_item === undefined) {
            command_data.msg.reply(`There isn't any item with id \`${item_ID}\`.`);
            return;
        }

        command_data.msg.guild.members.cache.forEach(async (member) => {
            const config = await command_data.global_context.neko_modules_clients.mySQL.fetch(command_data.global_context, { type: "global_user", id: member.user.id });
            for (let i = 0; i < amount; i++) {
                config.inventory.push({ id: randomBytes(16).toString("hex"), user_ID: member.user.id, item_ID: item_ID });
            }
            command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: config });
        });

        command_data.msg.channel.send(`Added \`${amount}x ${target_item.display_name}\` to \`${command_data.msg.guild.members.cache.size}\` members!`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
