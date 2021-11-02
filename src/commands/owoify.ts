/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "owoify",
    category: "Fun",
    description: "Makes NekoMaid say something with a lot of uwus and owos (/-\\).",
    helpUsage: "[text]`",
    exampleUsage: "please i need help",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in what you want Nekomaid to say.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("me", Permissions.FLAGS.MANAGE_MESSAGES)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.server_config.say_command == false) {
            return;
        }
        if ((command_data.msg.mentions.members !== null && command_data.msg.mentions.members.size > 0) || command_data.msg.mentions.roles.size > 0 || command_data.msg.mentions.everyone === true) {
            command_data.msg.reply("Please remove all mentions before trying again!");
            return;
        }
        if (command_data.msg.content.includes("@everyone") || command_data.msg.content.includes("@here")) {
            command_data.msg.reply("Please remove all mentions before trying again!");
            return;
        }

        const owoified_text = await command_data.global_context.modules.neko.sfw.OwOify({ text: command_data.total_argument });
        command_data.msg.channel.send(owoified_text.owo).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        command_data.msg.delete().catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
