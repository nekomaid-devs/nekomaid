module.exports = {
    name: "buildingsglobal",
    category: "Profile",
    description: "Displays the global buildings.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) { 
        let mayor = await command_data.global_context.bot.users.fetch(command_data.global_context.bot_config.mayor_ID);
        
        let buildings_description = "";
        buildings_description += `**Mayor:** \`${mayor.tag}\` (${mayor})\n\n`;
        buildings_description += `\`[Neko's Mayor House]      [${false ? "---LOCKED---" : "=".repeat(command_data.global_context.bot_config.b_mayor_house) + ">" + " ".repeat(10 - command_data.global_context.bot_config.b_mayor_house)}] Level ${command_data.global_context.bot_config.b_mayor_house} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_mayor_house, "b_mayor_house"))} $)\`\n`;
        buildings_description += `\`[Neko's Shrine]           [${"=".repeat(command_data.global_context.bot_config.b_shrine)}>${" ".repeat(10 - command_data.global_context.bot_config.b_shrine)}] Level ${command_data.global_context.bot_config.b_shrine} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_shrine, "b_shrine"))} $)\`\n`;
        buildings_description += `\`[Neko's Community Center] [${false ? "---LOCKED---" : "=".repeat(command_data.global_context.bot_config.b_community_center) + ">" + " ".repeat(10 - command_data.global_context.bot_config.b_community_center)}] Level ${command_data.global_context.bot_config.b_community_center} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_community_center, "b_community_center"))} $)\`\n`;
        buildings_description += `\`[Neko's Quantum Pancakes] [${"=".repeat(command_data.global_context.bot_config.b_quantum_pancakes)}>${" ".repeat(10 - command_data.global_context.bot_config.b_quantum_pancakes)}] Level ${command_data.global_context.bot_config.b_quantum_pancakes} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_quantum_pancakes, "b_quantum_pancakes"))} $)\`\n`;
        buildings_description += `\`[Neko's Crime Monopoly]   [${"=".repeat(command_data.global_context.bot_config.b_crime_monopoly)}>${" ".repeat(10 - command_data.global_context.bot_config.b_crime_monopoly)}] Level ${command_data.global_context.bot_config.b_crime_monopoly} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_crime_monopoly, "b_crime_monopoly"))} $)\`\n`;
        buildings_description += `\`[Neko's Pet Shelter]      [${false ? "---LOCKED---" : "=".repeat(command_data.global_context.bot_config.b_pet_shelter) + ">" + " ".repeat(10 - command_data.global_context.bot_config.b_pet_shelter)}] Level ${command_data.global_context.bot_config.b_pet_shelter} (${command_data.global_context.utils.format_number(command_data.global_context.neko_modules.vars.get_building_price(command_data.global_context.bot_config.b_pet_shelter, "b_pet_shelter"))} $)\``;

        let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedBuildings = {
            color: 8388736,
            author: {
                name: `Global Buildings`,
                icon_url: url
            },
            description: buildings_description,
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        command_data.msg.channel.send("", { embed: embedBuildings }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};