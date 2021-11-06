/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_arrest_gifs } from "../scripts/utils/util_vars";
import { pick_random } from "../scripts/utils/util_general";

export default {
    name: "arrest",
    category: "Actions",
    description: "Arrests the tagged person.",
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
        const url = pick_random(get_arrest_gifs());
        const suffix = command_data.tagged_users.length === 1 ? "is" : "are";
        const embedArrest = {
            title: `${command_data.tagged_user_tags} ${suffix} getting arrested!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.msg.channel.send({ embeds: [embedArrest] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
