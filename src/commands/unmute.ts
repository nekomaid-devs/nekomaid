/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes the tagged user.",
    helpUsage: "[mention] [?reason]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention an user.", "mention", true), new Argument(2, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS), new Permission("me", Permissions.FLAGS.MANAGE_ROLES)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.tagged_member.bannable === false) {
            command_data.message.reply(`Couldn't unmute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to unmute)`);
            return;
        }

        let unmute_reason = "None";
        if (command_data.args.length > 1) {
            unmute_reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[1]));
        }

        const previous_mute = command_data.guild_mutes.find((e) => {
            return e.user_ID === command_data.tagged_user.id;
        });
        if (previous_mute === undefined) {
            command_data.message.reply(`\`${command_data.tagged_user.tag}\` isn't muted-`);
        } else {
            if (command_data.guild_data.mute_role_ID === null) {
                command_data.message.reply("Couldn't find the Muted role! (Did somebody delete it?)");
                return;
            }

            const mute_role = await command_data.message.guild.roles.fetch(command_data.guild_data.mute_role_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                command_data.message.reply("Couldn't find the Muted role! (Did somebody delete it?)");
                return;
            }
            command_data.tagged_member.roles.remove(mute_role);

            command_data.message.channel.send(`Unmuted \`${command_data.tagged_user.tag}\`. (Reason: \`${unmute_reason}\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMuteRemove", { member: command_data.tagged_member, moderator: command_data.message.author, reason: unmute_reason, previous_mute: previous_mute });
        }
    },
} as Command;
