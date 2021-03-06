/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_building_description, get_building_field, get_global_building_field } from "../scripts/utils/vars";

export default {
    name: "building",
    category: "Profile",
    description: "Displays detailed information about a building.",
    helpUsage: "[building_name]`",
    exampleUsage: "Neko's Bank",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a building name.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const building_name = command_data.total_argument;

        const building_field = get_building_field(building_name.toLowerCase());
        const global_building_field = get_global_building_field(building_name.toLowerCase());
        if (building_field === undefined && global_building_field === undefined) {
            command_data.message.reply(`Haven't found any building with name \`${building_name}\`.`);
            return;
        }

        const building_description = get_building_description(building_field !== undefined ? building_field : global_building_field);
        const embedBuilding = {
            color: 8388736,
            title: `Building - ${building_name}`,
            description: building_description,
            footer: { text: `Requested by ${command_data.message.author.tag}` },
        };
        command_data.message.channel.send({ embeds: [embedBuilding] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
