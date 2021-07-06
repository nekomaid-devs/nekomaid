const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "ban",
    category: "Moderation",
    description: "Bans the tagged user.",
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/user_tag/ 1h Spamming",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention")
    ],
    argumentsRecommended: [
        new RecommendedArgument(2, "Argument needs to be a time format.", "none"),
        new RecommendedArgument(3, "Argument needs to be a reason.", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: support swapping arguments (or improve the format)
        // TODO: this should clear all messages from them aswell
        let time = command_data.args.length < 2 ? -1 : (command_data.args[1] === -1 ? -1 : command_data.global_context.neko_modules_clients.tc.convert_string_to_time_data(command_data.args[1]));
        if(time != -1 && time.status != 1) {
            command_data.msg.reply("You entered invalid time format (ex. `1d2h3m4s` or `-1`)-");
            return;
        }
        if(command_data.tagged_member.bannable === false) {
            command_data.msg.reply(`Couldn't ban \`${command_data.tagged_user.tag}\` (Try moving Nekomaid's permissions above the user you want to ban)-`);
            return;
        }

        let ban_reason = "None";
        if(command_data.args.length > 2) {
            ban_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1)
        }
        let previous_ban = command_data.server_bans.find(e => { return e.userID === command_data.tagged_user.id });

        let ban_start = Date.now();
        let ban_end = -1;
        let extended_time = (time.days * 86400000) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000);
        let extended_time_text = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(extended_time);

        if(previous_ban === undefined) {
            ban_end = ban_start + extended_time;
            let ban_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(ban_end - ban_start);
            command_data.msg.channel.send(`Banned \`${command_data.tagged_user.tag}\` for \`${extended_time_text}\` (Reason: \`${ban_reason}\`, Time: \`${ban_end_text}\`)-`).catch(e => { command_data.global_context.logger.api_error(e); });
        } else {
            command_data.msg.reply(`\`${command_data.tagged_user.tag}\` is already banned-`);
            return;
        }

        let server_ban = {
            id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
            serverID: command_data.msg.guild.id,
            userID: command_data.tagged_user.id,
            start: ban_start,
            reason: ban_reason,
            end: time === -1 ? -1 : ban_end
        }

        command_data.global_context.data.last_moderation_actions.set(command_data.msg.guild.id, { moderator: command_data.msg.author.id, duration: extended_time_text });
        command_data.global_context.neko_modules_clients.ssm.server_add.add_server_ban(command_data.global_context, server_ban);
        command_data.tagged_member.ban({ reason: ban_reason });
    }
};