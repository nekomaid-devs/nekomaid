/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import Argument from "../scripts/helpers/argument";

export default {
    name: "slowmode",
    category: "Moderation",
    description: "Set a slowmode for current channel.",
    helpUsage: "[seconds]`",
    exampleUsage: "10",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in number of seconds.", "int>0", true)],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_CHANNELS), new Permission("me", Permissions.FLAGS.MANAGE_CHANNELS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || !(command_data.message.channel instanceof TextChannel)) {
            return;
        }
        // TODO: add an option for "off/on" (and remember last slowmode)
        const time = parseInt(command_data.args[0]);
        command_data.message.channel.setRateLimitPerUser(time);
        command_data.message.channel.send(`Set current channel's slowmode to \`${time}\` s.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
