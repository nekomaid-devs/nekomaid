/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_lewd_gifs } from "../scripts/utils/vars";
import { pick_random } from "../scripts/utils/general";

export default {
    name: "lewd",
    category: "Emotes",
    description: "Posts a lewd reaction gif.",
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
        const url = pick_random(get_lewd_gifs());
        const embedLewd = {
            title: `${command_data.message.author.tag} thinks thats lewd!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.message.channel.send({ embeds: [embedLewd] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
