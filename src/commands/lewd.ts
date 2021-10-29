import { get_lewd_gifs } from "../scripts/utils/util_vars";
import { CommandData } from "../ts/types";

export default {
    name: "lewd",
    category: "Emotes",
    description: "Posts a lewd reaction gif.",
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
        const url = command_data.global_context.utils.pick_random(get_lewd_gifs());
        const embedLewd = {
            title: `${command_data.msg.author.tag} thinks thats lewd!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedLewd] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
