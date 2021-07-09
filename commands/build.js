const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "build",
    category: "Profile",
    description: "Shows progress on a certain building or progresses the building.",
    helpUsage: "\"[building_name]\" [ammount?]`",
    exampleUsage: "\"Bank\" 1000",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a building name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let building_name = command_data.total_argument.substring(command_data.total_argument.indexOf('"') + 1, command_data.total_argument.lastIndexOf('"'));
        let ammount = parseInt(command_data.args[command_data.args.length - 1]);

        let building_field = command_data.global_context.utils.get_building_field(building_name);
        let global_building_field = command_data.global_context.utils.get_global_building_field(building_name);
        if(building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        if(building_field !== undefined) {
            if(isNaN(ammount)) {
                let next_building_cost = command_data.global_context.utils.get_building_price(command_data.author_config[building_field], building_field);
                let building_description = "";
                building_description += `**Built:** ${command_data.global_context.utils.format_number(command_data.author_config[building_field + "_credits"])}/${command_data.global_context.utils.format_number(next_building_cost)} $\n`;
                building_description += `**Progress:** ${Math.round((command_data.author_config[building_field + "_credits"] / next_building_cost) * 100)}%\n`;
                building_description += `**Level:** ${command_data.author_config[building_field]}`;
                
                let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedBuild = {
                    color: 8388736,
                    author: {
                        name: `${building_name}`,
                        icon_url: url
                    },
                    description: building_description,
                    footer: {
                        text: `Requested by ${command_data.msg.author.tag}`
                    },
                }
                command_data.msg.channel.send("", { embed: embedBuild }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        }
        if(global_building_field !== undefined) {
            if(isNaN(ammount)) {
                let next_building_cost = command_data.global_context.utils.get_building_price(command_data.global_context.bot_config[global_building_field], global_building_field);
                let building_description = "";
                building_description += `**Built:** ${command_data.global_context.utils.format_number(command_data.global_context.bot_config[global_building_field + "_credits"])}/${command_data.global_context.utils.format_number(next_building_cost)} $\n`;
                building_description += `**Progress:** ${Math.round((command_data.global_context.bot_config[global_building_field + "_credits"] / next_building_cost) * 100)}%\n`;
                building_description += `**Level:** ${command_data.global_context.bot_config[global_building_field]}`;
                
                let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedBuild = {
                    color: 8388736,
                    author: {
                        name: `${building_name}`,
                        icon_url: url
                    },
                    description: building_description,
                    footer: {
                        text: `Requested by ${command_data.msg.author.tag}`
                    },
                }
                command_data.msg.channel.send("", { embed: embedBuild }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        }
    },
};