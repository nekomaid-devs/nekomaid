/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_arrest_gifs } from "../scripts/utils/vars";
import { format_users, pick_random } from "../scripts/utils/general";

export default {
    name: "arrest",
    category: "Actions",
    description: "Arrests the tagged person.",
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
        const url = pick_random(get_arrest_gifs());
        const suffix = command_data.tagged_users.length === 1 ? "is" : "are";
        const embedArrest = {
            title: `${format_users(command_data.tagged_users)} ${suffix} getting arrested!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.message.channel.send({ embeds: [embedArrest] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
