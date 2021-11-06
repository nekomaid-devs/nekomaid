/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes the tagged user.",
    helpUsage: "[mention] [?reason]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to mention an user.", "mention") ],
    argumentsRecommended: [ new RecommendedArgument(2, "Argument needs to be a reason.", "none") ],
    permissionsNeeded: [ new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS), new NeededPermission("me", Permissions.FLAGS.MANAGE_ROLES) ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.tagged_member.bannable === false) {
            command_data.msg.reply(`Couldn't unmute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to unmute)`);
            return;
        }

        let unmute_reason = "None";
        if (command_data.args.length > 1) {
            unmute_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]));
        }

        const previous_mute = command_data.server_mutes.find((e) => {
            return e.user_ID === command_data.tagged_user.id;
        });
        if (previous_mute === undefined) {
            command_data.msg.reply(`\`${command_data.tagged_user.tag}\` isn't muted-`);
        } else {
            if (command_data.server_config.mute_role_ID === null) {
                command_data.msg.reply("Couldn't find the Muted role! (Did somebody delete it?)");
                return;
            }

            const mute_role = await command_data.msg.guild.roles.fetch(command_data.server_config.mute_role_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                command_data.msg.reply("Couldn't find the Muted role! (Did somebody delete it?)");
                return;
            }
            command_data.tagged_member.roles.remove(mute_role);

            command_data.msg.channel.send(`Unmuted \`${command_data.tagged_user.tag}\`. (Reason: \`${unmute_reason}\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMuteRemove", { member: command_data.tagged_member, moderator: command_data.msg.author, reason: unmute_reason, previous_mute: previous_mute });
        }
    },
} as Command;
