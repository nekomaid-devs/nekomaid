/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_bite_gifs } from "../scripts/utils/vars";
import { format_users, pick_random } from "../scripts/utils/general";

export default {
    name: "bite",
    category: "Actions",
    description: "Bites the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const url = pick_random(get_bite_gifs());
        const embedBite = {
            title: `${command_data.message.author.tag} bites ${format_users(command_data.tagged_users)}!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.message.channel.send({ embeds: [embedBite] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
