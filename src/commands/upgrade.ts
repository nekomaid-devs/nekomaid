import { CommandData } from "../ts/types";

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
        if (command_data.msg.guild === null || command_data.global_context.bot.user === null) {
            return;
        }
        const building_name = command_data.total_argument;

        const building_field = get_building_field(building_name.toLowerCase());
        const global_building_field = get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        const embedUpgrade: any = {
            color: 8388736,
            author: {
                name: `Upgrading - ${building_name}`,
            },
        };

        if (building_field !== undefined) {
            const next_building_cost = get_building_price(command_data.author_user_config[building_field], building_field);
            if (next_building_cost === undefined) {
                command_data.msg.reply(`This building is already at it's max level.`);
                return;
            }
            if (command_data.author_user_config[building_field + "_credits"] < next_building_cost) {
                command_data.msg.reply(`The building haven't been built enough for an upgrade.`);
                return;
            }

            command_data.author_user_config[building_field] += 1;
            command_data.author_user_config[building_field + "_credits"] -= next_building_cost;

            command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

            const url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
            embedUpgrade.author.icon_url = url;
            embedUpgrade.description = `Upgraded the building onto level ${command_data.author_user_config[building_field]}.`;
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
        if (global_building_field !== undefined) {
            const next_building_cost = get_building_price(command_data.global_context.bot_config[global_building_field], global_building_field);
            if (command_data.msg.author.id !== command_data.global_context.bot_config.mayor_ID) {
                command_data.msg.reply(`Only the mayor can upgrade global buildings.`);
                return;
            }
            if (next_building_cost === undefined) {
                command_data.msg.reply(`This building is already at it's max level.`);
                return;
            }
            if (command_data.global_context.bot_config[global_building_field + "_credits"] < next_building_cost) {
                command_data.msg.reply(`The building haven't been built enough for an upgrade.`);
                return;
            }

            command_data.global_context.bot_config[global_building_field] += 1;
            command_data.global_context.bot_config[global_building_field + "_credits"] -= next_building_cost;

            command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "config", config: command_data.global_context.bot_config });

            const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            embedUpgrade.author.icon_url = url;
            embedUpgrade.description = `Upgraded the building onto level ${command_data.global_context.bot_config[global_building_field]}.`;
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
