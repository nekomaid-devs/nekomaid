/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "ban",
    category: "Moderation",
    description: "Bans the tagged user.",
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/user_tag/ 1h Spamming",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to mention somebody.", "mention") ],
    argumentsRecommended: [ new RecommendedArgument(2, "Argument needs to be a time format.", "none"), new RecommendedArgument(3, "Argument needs to be a reason.", "none") ],
    permissionsNeeded: [ new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS), new NeededPermission("me", Permissions.FLAGS.BAN_MEMBERS) ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        /*
         * TODO: support swapping arguments (or improve the format)
         * TODO: this should clear all messages from them aswell
         */
        const time = command_data.args.length < 2 ? -1 : command_data.args[1] === "-1" ? -1 : command_data.global_context.neko_modules.timeConvert.convert_string_to_time_data(command_data.args[1]);
        if (time !== -1 && time.status !== 1) {
            command_data.msg.reply("You entered invalid time format! (ex. `1d2h3m4s` or `-1`)");
            return;
        }
        if (command_data.tagged_member.bannable === false) {
            command_data.msg.reply(`Couldn't ban \`${command_data.tagged_user.tag}\`. (Try moving Nekomaid's permissions above the user you want to ban)`);
            return;
        }

        let ban_reason = "None";
        if (command_data.args.length > 2) {
            ban_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }
        const previous_ban = command_data.server_bans.find((e) => {
            return e.user_ID === command_data.tagged_user.id;
        });

        const ban_start = Date.now();
        let ban_end = -1;
        const extended_time = time.days * 86400000 + time.hrs * 3600000 + time.mins * 60000 + time.secs * 1000;
        const extended_time_text = time === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(extended_time);

        if (previous_ban === undefined) {
            ban_end = ban_start + extended_time;
            const ban_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(ban_end - ban_start);
            command_data.msg.channel.send(`Banned \`${command_data.tagged_user.tag}\` for \`${extended_time_text}\`. (Time: \`${ban_end_text}\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.msg.reply(`\`${command_data.tagged_user.tag}\` is already banned.`);
            return;
        }

        command_data.global_context.data.last_moderation_actions.set(command_data.msg.guild.id, { moderator: command_data.msg.author.id, duration: extended_time_text, start: ban_start, end: time === -1 ? -1 : ban_end, reason: ban_reason });
        command_data.tagged_member.ban({ reason: ban_reason });
    }
} as Command;
