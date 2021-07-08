const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "buildings",
    category: "Profile",
    description: "Displays the tagged user's buildings.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // User Buildings:
        // Neko's City Hall - unlocks more upgrades
        // Neko's Bank - more bank cap
        // Neko's Lab - upgrades give bonuses (maybe?)
        // Neko's Sanctuary - better bonuses from pets
        // Neko's Pancakes - better payout from work
        // Neko's Crime Den - better payout from crime
        // Neko's Lewd Services - hourly income
        // Neko's Casino - hourly income
        // Neko's Scarpyard - a neko finds items at random intervals
        // Neko's Pawn Shop - can sell junk for cash

        let data = { city_hall: 1, bank: 1, lab: 1, sanctuary: 1, pancakes: 1, crime_den: 1, lewd_services: 1, casino: 1, scrapyard: 1, pawn_shop: 1 }
        let buildings_description = "";
        buildings_description += `\`[Neko's City Hall]     [${"=".repeat(data.city_hall - 1)}>${" ".repeat(10 - data.city_hall)}] Level ${data.city_hall}\`\n`;
        buildings_description += `\`[Neko's Bank]          [${"=".repeat(data.bank - 1)}>${" ".repeat(10 - data.bank)}] Level ${data.bank}\`\n`;
        buildings_description += `\`[Neko's Lab]           [${"=".repeat(data.lab - 1)}>${" ".repeat(10 - data.lab)}] Level ${data.lab}\`\n`;
        buildings_description += `\`[Neko's Sanctuary]     [${"=".repeat(data.sanctuary - 1)}>${" ".repeat(10 - data.sanctuary)}] Level ${data.sanctuary}\`\n`;
        buildings_description += `\`[Neko's Pancakes]      [${"=".repeat(data.pancakes - 1)}>${" ".repeat(10 - data.pancakes)}] Level ${data.pancakes}\`\n`;
        buildings_description += `\`[Neko's Crime Den]     [${"=".repeat(data.crime_den - 1)}>${" ".repeat(10 - data.crime_den)}] Level ${data.crime_den}\`\n`;
        buildings_description += `\`[Neko's Lewd Services] [${"=".repeat(data.lewd_services - 1)}>${" ".repeat(10 - data.lewd_services)}] Level ${data.lewd_services}\`\n`;
        buildings_description += `\`[Neko's Casino]        [${"=".repeat(data.casino - 1)}>${" ".repeat(10 - data.casino)}] Level ${data.casino}\`\n`;
        buildings_description += `\`[Neko's Scarpyard]     [${"=".repeat(data.scrapyard - 1)}>${" ".repeat(10 - data.scrapyard)}] Level ${data.scrapyard}\`\n`;
        buildings_description += `\`[Neko's Pawn Shop]     [${"=".repeat(data.pawn_shop - 1)}>${" ".repeat(10 - data.pawn_shop)}] Level ${data.pawn_shop}\``;

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedBuildings = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Buildings`,
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