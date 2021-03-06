/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_building_field, get_building_price, get_global_building_field } from "../scripts/utils/vars";
import { format_number } from "../scripts/utils/general";

export default {
    name: "build",
    category: "Profile",
    description: "Shows progress on a certain building or progresses the building.",
    helpUsage: "[building_name] [amount?]`",
    exampleUsage: "Neko's Bank 1000",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a building name.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.global_context.bot.user === null) {
            return;
        }
        const amount = parseInt(command_data.args[command_data.args.length - 1]);
        const building_name = isNaN(amount) ? command_data.total_argument : command_data.args.slice(0, command_data.args.length - 1).join(" ");

        const building_field = get_building_field(building_name.toLowerCase());
        const global_building_field = get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.message.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        const author_user_data_map = new Map(Object.entries(command_data.user_data));
        if (building_field !== undefined) {
            const building_field_level = author_user_data_map.get(building_field);
            if (!(typeof building_field_level === "number")) {
                return;
            }
            const building_field_credits = author_user_data_map.get(`${building_field}_credits`);
            if (!(typeof building_field_credits === "number")) {
                return;
            }

            if (isNaN(amount)) {
                const next_building_cost = get_building_price(building_field_level, building_field);
                const next_building_cost_text = next_building_cost !== undefined ? format_number(next_building_cost) : "-";
                const progress = next_building_cost !== undefined ? ((building_field_credits / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**???? Built:** ${format_number(building_field_credits)}/${next_building_cost_text} $\n`;
                building_description += `**???? Progress:** ${progress}%\n`;
                building_description += `**??? Level:** ${author_user_data_map.get(building_field)}`;

                const url = command_data.message.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBuild = {
                    color: 8388736,
                    author: {
                        name: `${building_name}`,
                        icon_url: url === null ? undefined : url,
                    },
                    description: building_description,
                    footer: {
                        text: `Requested by ${command_data.message.author.tag}`,
                    },
                };
                command_data.message.channel.send({ embeds: [embedBuild] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else {
                if (amount <= 0) {
                    command_data.message.reply("Invalid credits amount.");
                    return;
                }
                if (command_data.user_data.credits - amount < 0) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }

                author_user_data_map.set("credits", command_data.user_data.credits - amount);
                author_user_data_map.set(`${building_field}_credits`, building_field_credits + amount);

                const a = Object.fromEntries(author_user_data_map) as any;
                command_data.global_context.neko_modules_clients.db.edit_user(a);

                const url = command_data.message.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBuildProgress = {
                    color: 8388736,
                    author: {
                        name: `Building - ${building_name}`,
                        icon_url: url === null ? undefined : url,
                    },
                    description: `Added \`${format_number(amount)} ????\` towards the construction.`,
                };
                command_data.message.channel.send({ embeds: [embedBuildProgress] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
        const bot_data_map = new Map(Object.entries(command_data.bot_data));
        if (global_building_field !== undefined) {
            const global_building_field_level = bot_data_map.get(global_building_field);
            if (!(typeof global_building_field_level === "number")) {
                return;
            }
            const global_building_field_credits = bot_data_map.get(`${global_building_field}_credits`);
            if (!(typeof global_building_field_credits === "number")) {
                return;
            }

            if (isNaN(amount)) {
                const next_building_cost = get_building_price(global_building_field_level, global_building_field);
                const next_building_cost_text = next_building_cost !== undefined ? format_number(next_building_cost) : "-";
                const progress = next_building_cost !== undefined ? ((global_building_field_credits / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**???? Built:** ${format_number(global_building_field_credits)}/${next_building_cost_text} $\n`;
                building_description += `**???? Global Progress:** ${progress}%\n`;
                building_description += `**??? Global Level:** ${bot_data_map.get(global_building_field)}`;

                const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBuild = {
                    color: 8388736,
                    author: {
                        name: `${building_name}`,
                        icon_url: url === null ? undefined : url,
                    },
                    description: building_description,
                    footer: {
                        text: `Requested by ${command_data.message.author.tag}`,
                    },
                };
                command_data.message.channel.send({ embeds: [embedBuild] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else {
                if (amount <= 0) {
                    command_data.message.reply("Invalid credits amount.");
                    return;
                }
                if (command_data.user_data.credits - amount < 0) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }

                author_user_data_map.set("credits", command_data.user_data.credits - amount);
                bot_data_map.set(`${global_building_field}_credits`, global_building_field_credits + amount);

                const a = Object.fromEntries(author_user_data_map) as any;
                const b = Object.fromEntries(bot_data_map) as any;
                command_data.global_context.neko_modules_clients.db.edit_user(a);
                command_data.global_context.neko_modules_clients.db.edit_config(b);

                const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                const embedBuildProgress = {
                    color: 8388736,
                    author: {
                        name: `Building - ${building_name}`,
                        icon_url: url === null ? undefined : url,
                    },
                    description: `Added \`${format_number(amount)} ????\` towards the construction.`,
                };
                command_data.message.channel.send({ embeds: [embedBuildProgress] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
    },
} as Command;
