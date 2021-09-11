const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "build",
    category: "Profile",
    description: "Shows progress on a certain building or progresses the building.",
    helpUsage: "[building_name] [ammount?]`",
    exampleUsage: "Neko's Bank 1000",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a building name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let ammount = parseInt(command_data.args[command_data.args.length - 1]);
        let building_name = isNaN(ammount) ? command_data.total_argument : command_data.args.slice(0, command_data.args.length - 1).join(" ");

        let building_field = command_data.global_context.neko_modules.vars.get_building_field(building_name);
        let global_building_field = command_data.global_context.neko_modules.vars.get_global_building_field(building_name);
        if(building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        let embedBuild = {
            color: 8388736,
            author: {
                name: `${building_name}`
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        let embedBuildProgress = {
            color: 8388736,
            author: {
                name: `Building - ${building_name}`
            }
        }
        
        if(building_field !== undefined) {
            if(isNaN(ammount)) {
                let next_building_cost = command_data.global_context.neko_modules.vars.get_building_price(command_data.author_config[building_field], building_field);
                let next_building_cost_text = next_building_cost !== undefined ? command_data.global_context.utils.format_number(next_building_cost) : "-";
                let progress = next_building_cost !== undefined ? ((command_data.author_config[building_field + "_credits"] / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**🔨 Built:** ${command_data.global_context.utils.format_number(command_data.author_config[building_field + "_credits"])}/${next_building_cost_text} $\n`;
                building_description += `**📈 Progress:** ${progress}%\n`;
                building_description += `**⭐ Level:** ${command_data.author_config[building_field]}`;
                
                let url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuild.author.icon_url = url;
                embedBuild.description = building_description;
                command_data.msg.channel.send("", { embed: embedBuild }).catch(e => { command_data.global_context.logger.api_error(e); });
            } else {
                if(ammount <= 0) {
                    command_data.msg.reply(`Invalid credits ammount.`);
                    return;
                }
                if(command_data.author_config.credits - ammount < 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }

                command_data.author_config.credits -= ammount;
                command_data.author_config[building_field + "_credits"] += ammount;

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });
            
                let url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuildProgress.author.icon_url = url;
                embedBuildProgress.description = `Added \`${command_data.global_context.utils.format_number(ammount)} 💵\` towards the construction.`;
                command_data.msg.channel.send("", { embed: embedBuildProgress }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        }
        if(global_building_field !== undefined) {
            if(isNaN(ammount)) {
                let next_building_cost = command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config[global_building_field], global_building_field);
                let next_building_cost_text = next_building_cost !== undefined ? command_data.global_context.utils.format_number(next_building_cost) : "-";
                let progress = next_building_cost !== undefined ? ((command_data.global_context.bot_config[global_building_field + "_credits"] / next_building_cost) * 100).toFixed(2) : "0";
                let building_description = "";
                building_description += `**🔨 Built:** ${command_data.global_context.utils.format_number(command_data.global_context.bot_config[global_building_field + "_credits"])}/${next_building_cost_text} $\n`;
                building_description += `**📈 Global Progress:** ${progress}%\n`;
                building_description += `**⭐ Global Level:** ${command_data.global_context.bot_config[global_building_field]}`;
                
                let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuild.author.icon_url = url;
                embedBuild.description = building_description;
                command_data.msg.channel.send("", { embed: embedBuild }).catch(e => { command_data.global_context.logger.api_error(e); });
            } else {
                if(ammount <= 0) {
                    command_data.msg.reply(`Invalid credits ammount.`);
                    return;
                }
                if(command_data.author_config.credits - ammount < 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }

                command_data.author_config.credits -= ammount;
                command_data.global_context.bot_config[global_building_field + "_credits"] += ammount;

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", config: command_data.global_context.bot_config });
            
                let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                embedBuildProgress.author.icon_url = url;
                embedBuildProgress.description = `Added \`${command_data.global_context.utils.format_number(ammount)} 💵\` towards the construction.`;
                command_data.msg.channel.send("", { embed: embedBuildProgress }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        }
    },
};