/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_slap_gifs } from "../scripts/utils/util_vars";

export default {
    name: "slap",
    category: "Actions",
    description: "Slaps the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need mention somebody.", "mention") ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const url = command_data.global_context.utils.pick_random(get_slap_gifs());
        const embedSlap = {
            title: `${command_data.msg.author.tag} slaps ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        };

        command_data.msg.channel.send({ embeds: [ embedSlap ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
