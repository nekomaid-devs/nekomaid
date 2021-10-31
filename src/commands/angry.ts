/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import { get_angry_gifs } from "../scripts/utils/util_vars";

export default {
    name: "angry",
    category: "Emotes",
    description: "Posts an angry gif.",
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
        const url = command_data.global_context.utils.pick_random(get_angry_gifs());
        const embedAngry = {
            title: `${command_data.msg.author.tag} is angry!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedAngry] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
