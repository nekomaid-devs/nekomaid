/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import { convert_string_to_time_data, convert_time } from "../scripts/utils/util_time";

function create_mute_role_and_mute(command_data: CommandData) {
    if (command_data.message.guild === null) {
        return;
    }

    command_data.message.guild.roles
        .create({
            name: "Muted",
            color: "#4b4b4b",
            hoist: true,
            mentionable: false,
            permissions: [],
        })
        .then(async (mute_role) => {
            if (command_data.message.guild === null) {
                return;
            }

            (await command_data.message.guild.channels.fetch()).forEach((channel) => {
                if (channel.type === "GUILD_TEXT") {
                    channel.permissionOverwrites
                        .create(mute_role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                } else if (channel.type === "GUILD_VOICE") {
                    channel.permissionOverwrites
                        .create(mute_role, {
                            CONNECT: false,
                            SPEAK: false,
                        })
                        .catch((e: Error) => {
                            command_data.global_context.logger.api_error(e);
                        });
                }
            });

            // TODO: please just await
            command_data.tagged_member.roles
                .add(mute_role)
                .then(() => {
                    command_data.guild_data.mute_role_ID = mute_role.id;
                    command_data.global_context.neko_modules_clients.db.edit_guild(command_data.guild_data);
                })
                .catch((e) => {
                    command_data.message.reply(`Couldn't mute \`${command_data.tagged_member.user.tag}\`! (Try moving Nekomaid's permissions above the user you want to mute)`);
                    command_data.global_context.logger.error(e);
                });
        });
}

export default {
    name: "mute",
    category: "Moderation",
    description: "Mutes the tagged user.",
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/user_tag/ 6h Posting invites",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention an user.", "mention", true), new Argument(2, "Argument needs to be a time format.", "none", false), new Argument(3, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS), new Permission("me", Permissions.FLAGS.MANAGE_ROLES), new Permission("me", Permissions.FLAGS.MANAGE_CHANNELS)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }

        // TODO: previous mutes don't get removed btw
        const time = command_data.args.length < 2 ? -1 : command_data.args[1] === "-1" ? -1 : convert_string_to_time_data(command_data.args[1]);
        if (time === undefined) {
            command_data.message.reply("You entered invalid time format! (ex. `1d2h3m4s` or `-1`)");
            return;
        }
        if (command_data.tagged_member.bannable === false) {
            command_data.message.reply(`Couldn't mute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to mute)`);
            return;
        }

        let mute_reason = "None";
        if (command_data.args.length > 2) {
            mute_reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }
        let previous_mute: any;
        command_data.guild_mutes.forEach((mute) => {
            if (mute.user_ID === command_data.tagged_user.id) {
                previous_mute = mute;
            }
        });
        // TODO: custom durations are bugged
        const mute_start = Date.now();
        let mute_end = -1;
        const extended_time = time === -1 ? -1 : time.days * 86400000 + time.hrs * 3600000 + time.mins * 60000 + time.secs * 1000;
        const extended_time_text = time === -1 ? "Forever" : convert_time(extended_time);

        if (previous_mute === -1) {
            mute_end = mute_start + extended_time;
            const mute_end_text = time === -1 ? "Forever" : convert_time(mute_end - mute_start);

            command_data.message.channel.send(`Muted \`${command_data.tagged_user.tag}\` for \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMute", {
                member: command_data.tagged_member,
                moderator: command_data.message.author,
                reason: mute_reason,
                duration: mute_end_text,
                mute_start: mute_start,
                mute_end: mute_end,
                time: time,
            });
        } else {
            mute_end = previous_mute.end + extended_time;
            const prev_mute_end_text = previous_mute.end === -1 ? "Forever" : convert_time(previous_mute.end - mute_start);
            const mute_end_text = time === -1 ? "Forever" : convert_time(mute_end - mute_start);

            command_data.message.channel.send(`Extended mute of \`${command_data.tagged_user.tag}\` by \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMuteExt", {
                member: command_data.tagged_member,
                moderator: command_data.message.author,
                reason: mute_reason,
                prev_duration: prev_mute_end_text,
                next_duration: mute_end_text,
                mute_start: mute_start,
                mute_end: mute_end,
                time: time,
            });
        }

        if (command_data.guild_data.mute_role_ID === null) {
            create_mute_role_and_mute(command_data);
            return;
        }

        const mute_role = await command_data.message.guild.roles.fetch(command_data.guild_data.mute_role_ID).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (mute_role === null) {
            create_mute_role_and_mute(command_data);
        } else {
            command_data.tagged_member.roles.add(mute_role);
        }
    },
} as Command;
