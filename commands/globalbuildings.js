module.exports = {
    name: "globalbuildings",
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
        // Global Buildings:
        // Neko's Mayor House - unlocks bonuses for mayor and more upgrades (and something else?)
        // Neko's Shrine - unlock bonuses for all players
        // Neko's Community Center - improves event payouts, etc.
        // Neko's Quantum Pancakes - better payout from work for all players (and something else?)
        // Neko's Crime Monopoly - better payout from crime for all players (and something else?)
        // Neko's Pet Shelter - unlocks better pets and sells them
        
        let buildings_description = "";
        buildings_description += `\`[Neko's Mayor House]      [${"=".repeat(command_data.global_context.bot_config.b_mayor_house - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_mayor_house)}] Level ${command_data.global_context.bot_config.b_mayor_house} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_mayor_house, "b_mayor_house"))} $)\`\n`;
        buildings_description += `\`[Neko's Shrine]           [${"=".repeat(command_data.global_context.bot_config.b_shrine - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_shrine)}] Level ${command_data.global_context.bot_config.b_shrine} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_shrine, "b_shrine"))} $)\`\n`;
        buildings_description += `\`[Neko's Community Center] [${"=".repeat(command_data.global_context.bot_config.b_community_center - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_community_center)}] Level ${command_data.global_context.bot_config.b_community_center} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_community_center, "b_community_center"))} $)\`\n`;
        buildings_description += `\`[Neko's Quantum Pancakes] [${"=".repeat(command_data.global_context.bot_config.b_quantum_pancakes - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_quantum_pancakes)}] Level ${command_data.global_context.bot_config.b_quantum_pancakes} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_quantum_pancakes, "b_quantum_pancakes"))} $)\`\n`;
        buildings_description += `\`[Neko's Crime Monopoly]   [${"=".repeat(command_data.global_context.bot_config.b_crime_monopoly - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_crime_monopoly)}] Level ${command_data.global_context.bot_config.b_crime_monopoly} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_crime_monopoly, "b_crime_monopoly"))} $)\`\n`;
        buildings_description += `\`[Neko's Pet Shelter]      [${"=".repeat(command_data.global_context.bot_config.b_pet_shelter - 1)}>${" ".repeat(10 - command_data.global_context.bot_config.b_pet_shelter)}] Level ${command_data.global_context.bot_config.b_pet_shelter} (${command_data.global_context.utils.format_number(command_data.global_context.utils.get_building_price(command_data.global_context.bot_config.b_pet_shelter, "b_pet_shelter"))} $)\``;

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