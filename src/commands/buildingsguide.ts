/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_buildings_guide_embed } from "../scripts/utils/vars";

export default {
    name: "buildingsguide",
    category: "Profile",
    description: "Displays general information about all buildings.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        command_data.message.channel.send({ embeds: [get_buildings_guide_embed(command_data)] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
