/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import { get_blush_gifs } from "../scripts/utils/util_vars";

export default {
    name: "blush",
    category: "Emotes",
    description: "Posts a blushing gif.",
    helpUsage: "`",
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
        const url = command_data.global_context.utils.pick_random(get_blush_gifs());
        const embedBlush = {
            title: `${command_data.msg.author.tag} is blushing!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedBlush] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
