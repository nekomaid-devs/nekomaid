const RecommendedArgument = require("../scripts/helpers/recommended_argument");

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

        let data = { mayor_house: 1, shrine: 1, community_center: 1, quantum_pancakes: 1, crime_monopoly: 1, pet_shelter: 1 }
        let buildings_description = "";
        buildings_description += `\`[Neko's Mayor House]      [${"=".repeat(data.mayor_house - 1)}>${" ".repeat(10 - data.mayor_house)}] Level ${data.mayor_house}\`\n`;
        buildings_description += `\`[Neko's Shrine]           [${"=".repeat(data.shrine - 1)}>${" ".repeat(10 - data.shrine)}] Level ${data.shrine}\`\n`;
        buildings_description += `\`[Neko's Community Center] [${"=".repeat(data.community_center - 1)}>${" ".repeat(10 - data.community_center)}] Level ${data.community_center}\`\n`;
        buildings_description += `\`[Neko's Quantum Pancakes] [${"=".repeat(data.quantum_pancakes - 1)}>${" ".repeat(10 - data.quantum_pancakes)}] Level ${data.quantum_pancakes}\`\n`;
        buildings_description += `\`[Neko's Crime Monopoly]   [${"=".repeat(data.crime_monopoly - 1)}>${" ".repeat(10 - data.crime_monopoly)}] Level ${data.crime_monopoly}\`\n`;
        buildings_description += `\`[Neko's Pet Shelter]      [${"=".repeat(data.pet_shelter - 1)}>${" ".repeat(10 - data.pet_shelter)}] Level ${data.pet_shelter}\``;

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