/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_building_price } from "../scripts/utils/vars";
import { format_number } from "../scripts/utils/general";

export default {
    name: "buildings",
    category: "Profile",
    description: "Displays the tagged user's buildings.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let buildings_description = "";
        buildings_description += `\`[Neko's City Hall]     [${`${"=".repeat(command_data.tagged_user_data.b_city_hall)}>${" ".repeat(10 - command_data.tagged_user_data.b_city_hall)}`}] Level ${
            command_data.tagged_user_data.b_city_hall
        } (${format_number(get_building_price(command_data.tagged_user_data.b_city_hall, "b_city_hall"))} $)\`\n`;
        buildings_description += `\`[Neko's Bank]          [${"=".repeat(command_data.tagged_user_data.b_bank)}>${" ".repeat(10 - command_data.tagged_user_data.b_bank)}] Level ${command_data.tagged_user_data.b_bank} (${format_number(
            get_building_price(command_data.tagged_user_data.b_bank, "b_bank")
        )} $)\`\n`;
        buildings_description += `\`[Neko's Lab]           [${`${"=".repeat(command_data.tagged_user_data.b_lab)}>${" ".repeat(10 - command_data.tagged_user_data.b_lab)}`}] Level ${command_data.tagged_user_data.b_lab} (${format_number(
            get_building_price(command_data.tagged_user_data.b_lab, "b_lab")
        )} $)\`\n`;
        buildings_description += `\`[Neko's Sanctuary]     [${`${"=".repeat(command_data.tagged_user_data.b_sanctuary)}>${" ".repeat(10 - command_data.tagged_user_data.b_sanctuary)}`}] Level ${
            command_data.tagged_user_data.b_sanctuary
        } (${format_number(get_building_price(command_data.tagged_user_data.b_sanctuary, "b_sanctuary"))} $)\`\n`;
        buildings_description += `\`[Neko's Pancakes]      [${"=".repeat(command_data.tagged_user_data.b_pancakes)}>${" ".repeat(10 - command_data.tagged_user_data.b_pancakes)}] Level ${
            command_data.tagged_user_data.b_pancakes
        } (${format_number(get_building_price(command_data.tagged_user_data.b_pancakes, "b_pancakes"))} $)\`\n`;
        buildings_description += `\`[Neko's Crime Den]     [${"=".repeat(command_data.tagged_user_data.b_crime_den)}>${" ".repeat(10 - command_data.tagged_user_data.b_crime_den)}] Level ${
            command_data.tagged_user_data.b_crime_den
        } (${format_number(get_building_price(command_data.tagged_user_data.b_crime_den, "b_crime_den"))} $)\`\n`;
        buildings_description += `\`[Neko's Lewd Services] [${"=".repeat(command_data.tagged_user_data.b_lewd_services)}>${" ".repeat(10 - command_data.tagged_user_data.b_lewd_services)}] Level ${
            command_data.tagged_user_data.b_lewd_services
        } (${format_number(get_building_price(command_data.tagged_user_data.b_lewd_services, "b_lewd_services"))} $)\`\n`;
        buildings_description += `\`[Neko's Casino]        [${"=".repeat(command_data.tagged_user_data.b_casino)}>${" ".repeat(10 - command_data.tagged_user_data.b_casino)}] Level ${command_data.tagged_user_data.b_casino} (${format_number(
            get_building_price(command_data.tagged_user_data.b_casino, "b_casino")
        )} $)\`\n`;
        buildings_description += `\`[Neko's Scrapyard]     [${"=".repeat(command_data.tagged_user_data.b_scrapyard)}>${" ".repeat(10 - command_data.tagged_user_data.b_scrapyard)}] Level ${
            command_data.tagged_user_data.b_scrapyard
        } (${format_number(get_building_price(command_data.tagged_user_data.b_scrapyard, "b_scrapyard"))} $)\`\n`;
        buildings_description += `\`[Neko's Pawn Shop]     [${"=".repeat(command_data.tagged_user_data.b_pawn_shop)}>${" ".repeat(10 - command_data.tagged_user_data.b_pawn_shop)}] Level ${
            command_data.tagged_user_data.b_pawn_shop
        } (${format_number(get_building_price(command_data.tagged_user_data.b_pawn_shop, "b_pawn_shop"))} $)\``;

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedBuildings = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Buildings`,
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
