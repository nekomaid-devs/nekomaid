/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { pick_random } from "../scripts/utils/util_general";

export default {
    name: "someone",
    category: "Moderation",
    description: "Pings a random person on the server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.MENTION_EVERYONE)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const user = pick_random(Array.from((await command_data.message.guild.members.fetch()).values()));
        command_data.message.channel.send(`Pinged ${user.toString()}.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
