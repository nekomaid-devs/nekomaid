/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_dance_gifs } from "../scripts/utils/util_vars";
import { pick_random } from "../scripts/utils/util_general";

export default {
    name: "dance",
    category: "Emotes",
    description: "Posts a dancing gif.",
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
        const url = pick_random(get_dance_gifs());
        const embedDance = {
            title: `${command_data.msg.author.tag} is dancing!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedDance] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
