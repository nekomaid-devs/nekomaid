const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
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
    execute(command_data) {
        let building_name = command_data.total_argument;

        let building_field = command_data.global_context.neko_modules.vars.get_building_field(building_name.toLowerCase());
        let global_building_field = command_data.global_context.neko_modules.vars.get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        let embedUpgrade = {
            color: 8388736,
            author: {
                name: `Upgrading - ${building_name}`,
            },
        };

        if (building_field !== undefined) {
            let next_building_cost = command_data.global_context.neko_modules.vars.get_building_price(command_data.author_config[building_field], building_field);
            if (next_building_cost === undefined) {
                command_data.msg.reply(`This building is already at it's max level.`);
                return;
            }
            if (command_data.author_config[building_field + "_credits"] < next_building_cost) {
                command_data.msg.reply(`The building haven't been built enough for an upgrade.`);
                return;
            }

            command_data.author_config[building_field] += 1;
            command_data.author_config[building_field + "_credits"] -= next_building_cost;

            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

            let url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
            embedUpgrade.author.icon_url = url;
            embedUpgrade.description = `Upgraded the building onto level ${command_data.author_config[building_field]}.`;
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
        }
        if (global_building_field !== undefined) {
            let next_building_cost = command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config[global_building_field], global_building_field);
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

            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", config: command_data.global_context.bot_config });

            let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            embedUpgrade.author.icon_url = url;
            embedUpgrade.description = `Upgraded the building onto level ${command_data.global_context.bot_config[global_building_field]}.`;
            command_data.msg.channel.send({ embeds: [embedUpgrade] }).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
