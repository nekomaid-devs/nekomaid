import { get_borgar_gifs } from "../scripts/utils/util_vars";
import { CommandData } from "../ts/types";

export default {
    name: "borgar",
    category: "Emotes",
    description: "borgar.",
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
        const url = command_data.global_context.utils.pick_random(get_borgar_gifs());
        const embedBorgar = {
            title: `${command_data.msg.author.tag} eats a borgar!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedBorgar] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
