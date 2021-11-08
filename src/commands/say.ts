/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "say",
    category: "Utility",
    description: "Makes NekoMaid say something.",
    helpUsage: "[text]`",
    exampleUsage: "please i need help",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in what you want Nekomaid to say.", "none", true)],
    permissions: [new Permission("me", Permissions.FLAGS.MANAGE_MESSAGES)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.guild_data.say_command === false) {
            return;
        }
        if ((command_data.message.mentions.members !== null && command_data.message.mentions.members.size > 0) || command_data.message.mentions.roles.size > 0 || command_data.message.mentions.everyone === true) {
            command_data.message.reply("Please remove all mentions before trying again!");
            return;
        }
        if (command_data.message.content.includes("@everyone") || command_data.message.content.includes("@here")) {
            command_data.message.reply("Please remove all mentions before trying again!");
            return;
        }

        command_data.message.channel.send(command_data.total_argument).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        command_data.message.delete().catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
