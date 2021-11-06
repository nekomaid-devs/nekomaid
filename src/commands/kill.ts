/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_kill_gifs } from "../scripts/utils/util_vars";

export default {
    name: "kill",
    category: "Actions",
    description: "Kills the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to mention somebody.", "mention") ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const is_self = command_data.tagged_users.some((e) => {
            return e.id === command_data.msg.author.id;
        });
        if (is_self === true) {
            command_data.msg.reply("Let's not do that ;-;");
            return;
        }

        const url = command_data.global_context.utils.pick_random(get_kill_gifs());
        const embedKill = {
            title: `${command_data.msg.author.tag} kills ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        };

        command_data.msg.channel.send({ embeds: [ embedKill ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
