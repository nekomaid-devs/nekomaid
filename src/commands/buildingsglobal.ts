/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_building_price } from "../scripts/utils/util_vars";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "buildingsglobal",
    category: "Profile",
    description: "Displays the global buildings.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.global_context.bot.user === null || command_data.bot_data === null) {
            return;
        }
        const mayor = await command_data.global_context.bot.users.fetch(command_data.bot_data.mayor_ID).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (mayor === null) {
            return;
        }

        let buildings_description = "";
        buildings_description += `**Mayor:** \`${mayor.tag}\` (${mayor})\n\n`;
        buildings_description += `\`[Neko's Mayor House]      [${`${"=".repeat(command_data.bot_data.b_mayor_house)}>${" ".repeat(10 - command_data.bot_data.b_mayor_house)}`}] Level ${command_data.bot_data.b_mayor_house} (${format_number(
            get_building_price(command_data.bot_data.b_mayor_house, "b_mayor_house")
        )} $)\`\n`;
        buildings_description += `\`[Neko's Shrine]           [${"=".repeat(command_data.bot_data.b_shrine)}>${" ".repeat(10 - command_data.bot_data.b_shrine)}] Level ${command_data.bot_data.b_shrine} (${format_number(
            get_building_price(command_data.bot_data.b_shrine, "b_shrine")
        )} $)\`\n`;
        buildings_description += `\`[Neko's Community Center] [${`${"=".repeat(command_data.bot_data.b_community_center)}>${" ".repeat(10 - command_data.bot_data.b_community_center)}`}] Level ${
            command_data.bot_data.b_community_center
        } (${format_number(get_building_price(command_data.bot_data.b_community_center, "b_community_center"))} $)\`\n`;
        buildings_description += `\`[Neko's Quantum Pancakes] [${"=".repeat(command_data.bot_data.b_quantum_pancakes)}>${" ".repeat(10 - command_data.bot_data.b_quantum_pancakes)}] Level ${
            command_data.bot_data.b_quantum_pancakes
        } (${format_number(get_building_price(command_data.bot_data.b_quantum_pancakes, "b_quantum_pancakes"))} $)\`\n`;
        buildings_description += `\`[Neko's Crime Monopoly]   [${"=".repeat(command_data.bot_data.b_crime_monopoly)}>${" ".repeat(10 - command_data.bot_data.b_crime_monopoly)}] Level ${
            command_data.bot_data.b_crime_monopoly
        } (${format_number(get_building_price(command_data.bot_data.b_crime_monopoly, "b_crime_monopoly"))} $)\`\n`;
        buildings_description += `\`[Neko's Pet Shelter]      [${`${"=".repeat(command_data.bot_data.b_pet_shelter)}>${" ".repeat(10 - command_data.bot_data.b_pet_shelter)}`}] Level ${command_data.bot_data.b_pet_shelter} (${format_number(
            get_building_price(command_data.bot_data.b_pet_shelter, "b_pet_shelter")
        )} $)\``;

        const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedBuildings = {
            color: 8388736,
            author: {
                name: "Global Buildings",
                icon_url: url === null ? undefined : url,
            },
            description: buildings_description,
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedBuildings] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
