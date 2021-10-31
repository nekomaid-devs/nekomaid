/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import { get_cry_gifs } from "../scripts/utils/util_vars";

export default {
    name: "cry",
    category: "Emotes",
    description: "Posts a crying gif.",
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
        const url = command_data.global_context.utils.pick_random(get_cry_gifs());
        const embedCry = {
            title: `${command_data.msg.author.tag} is crying...`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedCry] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
