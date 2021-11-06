/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededPermission from "../scripts/helpers/needed_permission";
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "kick",
    category: "Moderation",
    description: "Kicks the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Breaking rules",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention an user.", "mention")],
    argumentsRecommended: [new RecommendedArgument(2, "Argument needs to be a reason.", "none")],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.tagged_user === undefined) {
            return;
        }
        if (command_data.tagged_member.kickable === false) {
            command_data.msg.reply(`Couldn't kick \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to kick)`);
            return;
        }

        let kick_reason = "None";
        if (command_data.args.length > 1) {
            kick_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }

        command_data.msg.channel.send(`Kicked \`${command_data.tagged_user.tag}\`. (Reason: \`${kick_reason}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        command_data.global_context.data.last_moderation_actions.set(command_data.msg.guild.id, { moderator: command_data.msg.author.id });
        command_data.tagged_member.kick(kick_reason);
    },
} as Command;
