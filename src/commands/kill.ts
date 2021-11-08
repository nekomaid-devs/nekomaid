/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_kill_gifs } from "../scripts/utils/util_vars";
import { format_users, pick_random } from "../scripts/utils/util_general";

export default {
    name: "kill",
    category: "Actions",
    description: "Kills the tagged person.",
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
        const is_self = command_data.tagged_users.some((e) => {
            return e.id === command_data.message.author.id;
        });
        if (is_self === true) {
            command_data.message.reply("Let's not do that ;-;");
            return;
        }

        const url = pick_random(get_kill_gifs());
        const embedKill = {
            title: `${command_data.message.author.tag} kills ${format_users(command_data.tagged_users)}!`,
            color: 8388736,
            image: {
                url: url,
            },
        };

        command_data.message.channel.send({ embeds: [embedKill] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
