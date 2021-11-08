/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import Argument from "../scripts/helpers/argument";

export default {
    name: "kick",
    category: "Moderation",
    description: "Kicks the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Breaking rules",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention an user.", "mention", true), new Argument(2, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.tagged_user === undefined) {
            return;
        }
        if (command_data.tagged_member.kickable === false) {
            command_data.message.reply(`Couldn't kick \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to kick)`);
            return;
        }

        let kick_reason = "None";
        if (command_data.args.length > 1) {
            kick_reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }

        command_data.message.channel.send(`Kicked \`${command_data.tagged_user.tag}\`. (Reason: \`${kick_reason}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        command_data.global_context.data.last_moderation_actions.set(command_data.message.guild.id, { moderator: command_data.message.author.id });
        command_data.tagged_member.kick(kick_reason);
    },
} as Command;
