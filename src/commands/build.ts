/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_building_field, get_building_price, get_global_building_field } from "../scripts/utils/util_vars";

export default {
    name: "build",
    category: "Profile",
    description: "Shows progress on a certain building or progresses the building.",
    helpUsage: "[building_name] [amount?]`",
    exampleUsage: "Neko's Bank 1000",
    hidden: false,
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
        const amount = parseInt(command_data.args[command_data.args.length - 1]);
        const building_name = isNaN(amount) ? command_data.total_argument : command_data.args.slice(0, command_data.args.length - 1).join(" ");

        const building_field = get_building_field(building_name.toLowerCase());
        const global_building_field = get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        const embedBuild: any = {
            color: 8388736,
            author: {
                name: `${building_name}`,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };
        const embedBuildProgress: any = {
            color: 8388736,
            author: {
                name: `Building - ${building_name}`,
            },
        };

        const author_user_config_map = new Map(Object.entries(command_data.author_user_config));
        if (building_field !== undefined) {
            const building_field_level = author_user_config_map.get(building_field);
            if (!(typeof building_field_level === "number")) {
                return;
            }
            const building_field_credits = author_user_config_map.get(building_field + "_credits");
            if (!(typeof building_field_credits === "number")) {
                return;
            }

            if (isNaN(amount)) {
                const next_building_cost = get_building_price(building_field_level, building_field);
                const next_building_cost_text = next_building_cost !== undefined ? command_data.global_context.utils.format_number(next_building_cost) : "-";
                const progress = next_building_cost !== undefined ? ((building_field_credits / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**🔨 Built:** ${command_data.global_context.utils.format_number(building_field_credits)}/${next_building_cost_text} $\n`;
                building_description += `**📈 Progress:** ${progress}%\n`;
                building_description += `**⭐ Level:** ${author_user_config_map.get(building_field)}`;

                const url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuild.author.icon_url = url;
                embedBuild.description = building_description;
                command_data.msg.channel.send({ embeds: [embedBuild] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else {
                if (amount <= 0) {
                    command_data.msg.reply(`Invalid credits amount.`);
                    return;
                }
                if (command_data.author_user_config.credits - amount < 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }

                author_user_config_map.set("credits", command_data.author_user_config.credits - amount);
                author_user_config_map.set(building_field + "_credits", building_field_credits + amount);

                const a: any = Object.fromEntries(author_user_config_map);
                command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: a });

                const url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuildProgress.author.icon_url = url;
                embedBuildProgress.description = `Added \`${command_data.global_context.utils.format_number(amount)} 💵\` towards the construction.`;
                command_data.msg.channel.send({ embeds: [embedBuildProgress] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
        const bot_config_map = new Map(Object.entries(command_data.global_context.bot_config));
        if (global_building_field !== undefined) {
            const global_building_field_level = bot_config_map.get(global_building_field);
            if (!(typeof global_building_field_level === "number")) {
                return;
            }
            const global_building_field_credits = bot_config_map.get(global_building_field + "_credits");
            if (!(typeof global_building_field_credits === "number")) {
                return;
            }

            if (isNaN(amount)) {
                const next_building_cost = get_building_price(global_building_field_level, global_building_field);
                const next_building_cost_text = next_building_cost !== undefined ? command_data.global_context.utils.format_number(next_building_cost) : "-";
                const progress = next_building_cost !== undefined ? ((global_building_field_credits / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**🔨 Built:** ${command_data.global_context.utils.format_number(global_building_field_credits)}/${next_building_cost_text} $\n`;
                building_description += `**📈 Global Progress:** ${progress}%\n`;
                building_description += `**⭐ Global Level:** ${bot_config_map.get(global_building_field)}`;

                const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuild.author.icon_url = url;
                embedBuild.description = building_description;
                command_data.msg.channel.send({ embeds: [embedBuild] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else {
                if (amount <= 0) {
                    command_data.msg.reply(`Invalid credits amount.`);
                    return;
                }
                if (command_data.author_user_config.credits - amount < 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }

                author_user_config_map.set("credits", command_data.author_user_config.credits - amount);
                bot_config_map.set(global_building_field + "_credits", global_building_field_credits + amount);

                const a: any = Object.fromEntries(author_user_config_map);
                const b: any = Object.fromEntries(bot_config_map);
                command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: a });
                command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "config", config: b });

                const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuildProgress.author.icon_url = url;
                embedBuildProgress.description = `Added \`${command_data.global_context.utils.format_number(amount)} 💵\` towards the construction.`;
                command_data.msg.channel.send({ embeds: [embedBuildProgress] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
    },
} as Command;
