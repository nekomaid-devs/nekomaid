/* Types */
import { CommandData, Command } from "../ts/base";
import { GuildEditType } from "../scripts/db/db_utils";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

function create_mute_role_and_mute(command_data: CommandData) {
    if (command_data.msg.guild === null) {
        return;
    }

    command_data.msg.guild.roles
        .create({
            name: "Muted",
            color: "#4b4b4b",
            hoist: true,
            mentionable: false,
            permissions: [],
        })
        .then((mute_role) => {
            if (command_data.msg.guild === null) {
                return;
            }

            command_data.msg.guild.channels.cache.forEach((channel) => {
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
                    command_data.server_config.mute_role_ID = mute_role.id;
                    command_data.global_context.neko_modules_clients.db.edit_server(command_data.server_config, GuildEditType.ALL);
                })
                .catch((err) => {
                    command_data.global_context.logger.error(err);
                    command_data.msg.reply(`Couldn't mute \`${command_data.tagged_member.user.tag}\`! (Try moving Nekomaid's permissions above the user you want to mute)`);
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
    argumentsNeeded: [ new NeededArgument(1, "You need to mention an user.", "mention") ],
    argumentsRecommended: [ new RecommendedArgument(2, "Argument needs to be a time format.", "none"), new RecommendedArgument(3, "Argument needs to be a reason.", "none") ],
    permissionsNeeded: [ new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS), new NeededPermission("me", Permissions.FLAGS.MANAGE_ROLES), new NeededPermission("me", Permissions.FLAGS.MANAGE_CHANNELS) ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }

        // TODO: previous mutes don't get removed btw
        const time = command_data.args.length < 2 ? -1 : command_data.args[1] === "-1" ? -1 : command_data.global_context.neko_modules.timeConvert.convert_string_to_time_data(command_data.args[1]);
        if (time !== -1 && time.status !== 1) {
            command_data.msg.reply("You entered invalid time format! (ex. `1d2h3m4s` or `-1`)");
            return;
        }
        if (command_data.tagged_member.bannable === false) {
            command_data.msg.reply(`Couldn't mute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to mute)`);
            return;
        }

        let mute_reason = "None";
        if (command_data.args.length > 2) {
            mute_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }
        let previous_mute: any;
        command_data.server_mutes.forEach((mute) => {
            if (mute.user_ID === command_data.tagged_user.id) {
                previous_mute = mute;
            }
        });

        // TODO: custom durations are bugged
        const mute_start = Date.now();
        let mute_end = -1;
        const extended_time = time.days * 86400000 + time.hrs * 3600000 + time.mins * 60000 + time.secs * 1000;
        const extended_time_text = time === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(extended_time);

        if (previous_mute === -1) {
            mute_end = mute_start + extended_time;
            const mute_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(mute_end - mute_start);

            command_data.msg.channel.send(`Muted \`${command_data.tagged_user.tag}\` for \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMute", {
                member: command_data.tagged_member,
                moderator: command_data.msg.author,
                reason: mute_reason,
                duration: mute_end_text,
                mute_start: mute_start,
                mute_end: mute_end,
                time: time,
            });
        } else {
            mute_end = previous_mute.end + extended_time;
            const prev_mute_end_text = previous_mute.end === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(previous_mute.end - mute_start);
            const mute_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(mute_end - mute_start);

            command_data.msg.channel.send(`Extended mute of \`${command_data.tagged_user.tag}\` by \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMuteExt", {
                member: command_data.tagged_member,
                moderator: command_data.msg.author,
                reason: mute_reason,
                prev_duration: prev_mute_end_text,
                next_duration: mute_end_text,
                mute_start: mute_start,
                mute_end: mute_end,
                time: time,
            });
        }

        if (command_data.server_config.mute_role_ID === null) {
            create_mute_role_and_mute(command_data);
            return;
        }

        const mute_role = await command_data.msg.guild.roles.fetch(command_data.server_config.mute_role_ID).catch((e: Error) => {
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
