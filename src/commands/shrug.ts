/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_shrug_gifs } from "../scripts/utils/util_vars";

export default {
    name: "shrug",
    category: "Emotes",
    description: "Posts a shrugging gif.",
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
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const url = command_data.global_context.utils.pick_random(get_shrug_gifs());
        const embedShrug = {
            title: `${command_data.msg.author.tag} shrugs!`,
            color: 8388736,
            image: {
                url: url
            }
        };

        command_data.msg.channel.send({ embeds: [ embedShrug ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
