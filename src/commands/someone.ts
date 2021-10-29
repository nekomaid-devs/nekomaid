import { CommandData } from "../ts/types";

import NeededPermission from "../scripts/helpers/needed_permission";
import { Permissions } from "discord.js";

export default {
    name: "someone",
    category: "Moderation",
    description: "Pings a random person on the server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MENTION_EVERYONE)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        await command_data.global_context.utils.verify_guild_members(command_data.msg.guild);
        const user = command_data.global_context.utils.pick_random(Array.from(command_data.msg.guild.members.cache.values()));
        command_data.msg.channel.send(`Pinged ${user.toString()}.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
