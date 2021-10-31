/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_cuddle_gifs } from "../scripts/utils/util_vars";

export default {
    name: "cuddle",
    category: "Actions",
    description: "Cuddles the tagged person!",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const url = command_data.global_context.utils.pick_random(get_cuddle_gifs());
        const embedKiss = {
            title: `${command_data.msg.author.tag} cuddles ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedKiss] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
