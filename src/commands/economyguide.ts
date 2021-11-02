/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_economy_guide_embed } from "../scripts/utils/util_vars";

export default {
    name: "economyguide",
    category: "Profile",
    description: "Displays general information about the economy.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        command_data.msg.channel.send({ embeds: [get_economy_guide_embed(command_data)] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
