/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_think_gifs } from "../scripts/utils/util_vars";

export default {
    name: "think",
    category: "Emotes",
    description: "Posts a thinking gif.",
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
        const url = command_data.global_context.utils.pick_random(get_think_gifs());
        const embedThink = {
            title: `${command_data.msg.author.tag} is thinking!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [ embedThink ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
