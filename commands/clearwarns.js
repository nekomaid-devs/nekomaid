const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "clearwarns",
    category: "Moderation",
    description: "Clears warnings of the tagged user.",
    helpUsage: "[mention] [?reason]` *(optional argument)*",
    exampleUsage: "/user_tag/",
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
    async execute(command_data) {
        let warn_reason = "None";
        if(command_data.args.length > 1) {
            warn_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1)
        }

        let warns = command_data.server_warns.filter(warn =>
            warn.user_ID === command_data.tagged_user.id
        )
        command_data.msg.channel.send(`Cleared warnings of \`${command_data.tagged_user.tag}\`. (Reason: \`${warn_reason}\`, Strikes: \`${warns.length}\` => \`0\`)-`).catch(e => { command_data.global_context.logger.api_error(e); });
        command_data.global_context.bot.emit("guildMemberClearWarns", { member: command_data.tagged_member, moderator: command_data.msg.author, reason: warn_reason });
    }
};