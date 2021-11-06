/* Types */
import { CommandData, Command, UserItemData } from "../ts/base";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import { get_items } from "../scripts/utils/util_vars";

export default {
    name: "inventory",
    category: "Profile",
    description: "Displays the tagged user's inventory.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [ new RecommendedArgument(1, "Argument needs to be a mention.", "mention") ],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.tagged_user === undefined) {
            return;
        }
        const inventory = command_data.tagged_user_config.inventory;
        let inventory_text = "";
        if (inventory.length < 1) {
            inventory_text = "Empty";
        } else {
            const inventory_map = new Map();
            inventory.forEach((item: UserItemData) => {
                inventory_map.set(item.item_ID, inventory_map.has(item.item_ID) === true ? inventory_map.get(item.item_ID) + 1 : 1);
            });

            Array.from(inventory_map.keys()).forEach((id) => {
                if (command_data.global_context.bot_config === null) {
                    return;
                }
                const count = inventory_map.get(id);

                if (inventory_text !== "") {
                    inventory_text += ", ";
                }
                const item = get_items().get(id);
                if (item !== undefined) {
                    inventory_text += `\`${count}x ${item.display_name}\``;
                }
            });
        }

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedInventory = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Inventory (${inventory.length} items)`,
                icon_url: url === null ? undefined : url,
            },
            description: inventory_text.length < 3072 ? inventory_text : `${inventory_text.substring(0, 3069)}...`,
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };
        command_data.msg.channel.send({ embeds: [ embedInventory ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
