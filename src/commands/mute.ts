/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import { convert_string_to_ms } from "../scripts/utils/util_time";

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
        const time = command_data.args.length < 2 ? null : convert_string_to_ms(command_data.args[1]);
        const time_text = time === null ? "Forever" : time;
        let reason = "None";
        if (command_data.args.length > 2) {
            reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[2]));
        }

        if (command_data.tagged_member.bannable === false) {
            command_data.message.reply(`Couldn't mute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to mute)`);
            return;
        }

        const previous_mute = command_data.guild_mutes.find((e) => {
            return e.user_ID === command_data.tagged_user.id;
        });
        if (previous_mute === undefined) {
            command_data.message.channel.send(`Muted \`${command_data.tagged_user.tag}\` for \`${time_text}\`. (Reason: \`${reason}\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            command_data.global_context.bot.emit("guildMemberMuteAdd", {
                member: command_data.tagged_member,
                moderator: command_data.message.author,
                reason: reason,
                mute_start: Date.now(),
                mute_end: time === null ? null : Date.now() + time,
                time: time,
            });
        } else {
            command_data.message.reply(`\`${command_data.tagged_user.tag}\` is already muted.`);
            return;
        }

        if (command_data.guild_data.mute_role_ID !== null) {
            const mute_role = await command_data.message.guild.roles.fetch(command_data.guild_data.mute_role_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (mute_role === null) {
                create_mute_role_and_mute(command_data);
                return;
            }

            command_data.tagged_member.roles.add(mute_role);
        } else {
            create_mute_role_and_mute(command_data);
        }
    },
} as Command;
