/* Types */
import { CommandData, Command } from "../ts/base";

import { get_sleepy_gifs } from "../scripts/utils/util_vars";

export default {
    name: "sleepy",
    category: "Emotes",
    description: "Posts a sleepy gif.",
    helpUsage: "`",
    exampleUsage: "",
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
        const url = command_data.global_context.utils.pick_random(get_sleepy_gifs());
        const embedSleepy = {
            title: `${command_data.msg.author.tag} is sleepy!`,
            color: 8388736,
            image: {
                url: url
            }
        };

        command_data.msg.channel.send({ embeds: [ embedSleepy ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
