/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_tickle_gifs } from "../scripts/utils/util_vars";
import { pick_random } from "../scripts/utils/util_general";

export default {
    name: "tickle",
    category: "Actions",
    description: "Tickles the tagged person.",
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
        const url = pick_random(get_tickle_gifs());
        const embedTickle = {
            title: `${command_data.msg.author.tag} tickles ${command_data.tagged_user.tag}!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedTickle] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
