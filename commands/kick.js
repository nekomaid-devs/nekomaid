const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kicks the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Breaking rules",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user.", "mention")
    ],
    argumentsRecommended: [
        new RecommendedArgument(2, "Argument needs to be a reason.", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        if(command_data.tagged_member.kickable === false) {
            command_data.msg.reply(`Couldn't kick \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to kick)`);
            return;
        }

        let kick_reason = "None";
        if(command_data.args.length > 1) {
            kick_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1);
        }

        command_data.msg.channel.send(`Kicked \`${command_data.tagged_user.tag}\`. (Reason: \`${kick_reason}\`)`).catch(e => { command_data.global_context.logger.api_error(e); });

        command_data.global_context.data.last_moderation_actions.set(command_data.msg.guild.id, { moderator: command_data.msg.author.id });
        command_data.tagged_member.kick(kick_reason);
    }
};