/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_building_field, get_building_price, get_global_building_field } from "../scripts/utils/util_vars";

export default {
    name: "upgrade",
    category: "Profile",
    description: "Upgrades a certain building.",
    helpUsage: "[building_name]`",
    exampleUsage: "Neko's Bank",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in a building name.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot.user === null || command_data.global_context.bot_config === null) {
            return;
        }
        const building_name = command_data.total_argument;

        const building_field = get_building_field(building_name.toLowerCase());
        const global_building_field = get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        const author_user_config_map = new Map(Object.entries(command_data.author_user_config));
        if (building_field !== undefined) {
            const building_field_level = author_user_config_map.get(building_field);
            if (!(typeof building_field_level === "number")) {
                return;
            }
            const building_field_credits = author_user_config_map.get(`${building_field}_credits`);
            if (!(typeof building_field_credits === "number")) {
                return;
            }

            const next_building_cost = get_building_price(building_field_level, building_field);
            if (next_building_cost === undefined) {
                command_data.msg.reply("This building is already at it's max level.");
                return;
            }
            if (building_field_credits < next_building_cost) {
                command_data.msg.reply("The building haven't been built enough for an upgrade.");
                return;
            }

            author_user_config_map.set(building_field, building_field_level + 1);
            author_user_config_map.set(`${building_field}_credits`, building_field_credits - next_building_cost);

            const a = Object.fromEntries(author_user_config_map) as any;
            command_data.global_context.neko_modules_clients.db.edit_global_user(a);

            const url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedUpgrade = {
                color: 8388736,
                author: {
                    name: `Upgrading - ${building_name}`,
                    icon_url: url === null ? undefined : url,
                },
                description: `Upgraded the building onto level ${building_field_level + 1}.`,
            };
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
        const bot_config_map = new Map(Object.entries(command_data.global_context.bot_config));
        if (global_building_field !== undefined) {
            const global_building_field_level = bot_config_map.get(global_building_field);
            if (!(typeof global_building_field_level === "number")) {
                return;
            }
            const global_building_field_credits = bot_config_map.get(`${global_building_field}_credits`);
            if (!(typeof global_building_field_credits === "number")) {
                return;
            }

            const next_building_cost = get_building_price(global_building_field_level, global_building_field);
            if (command_data.msg.author.id !== command_data.global_context.bot_config.mayor_ID) {
                command_data.msg.reply("Only the mayor can upgrade global buildings.");
                return;
            }
            if (next_building_cost === undefined) {
                command_data.msg.reply("This building is already at it's max level.");
                return;
            }
            if (global_building_field_credits < next_building_cost) {
                command_data.msg.reply("The building haven't been built enough for an upgrade.");
                return;
            }

            bot_config_map.set(global_building_field, global_building_field_level + 1);
            bot_config_map.set(`${global_building_field}_credits`, global_building_field_credits - next_building_cost);

            const a = Object.fromEntries(bot_config_map) as any;
            command_data.global_context.neko_modules_clients.db.edit_config(a);

            const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            const embedUpgrade = {
                color: 8388736,
                author: {
                    name: `Upgrading - ${building_name}`,
                    icon_url: url === null ? undefined : url,
                },
                description: `Upgraded the building onto level ${global_building_field_level + 1}.`,
            };
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
