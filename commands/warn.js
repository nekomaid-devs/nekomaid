const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "warn",
    category: "Moderation",
    description: "Warns the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Said a bad word",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention")
    ],
    argumentsRecommended: [
        new RecommendedArgument(2, "Argument needs to be a reason.", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let warn_reason = "None";
        if(command_data.args.length > 1) {
            warn_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        let num_of_warnings = command_data.server_warns.filter(warn =>
            warn.user_ID === command_data.tagged_user.id
        ).length;
        command_data.msg.channel.send(`Warned \`${command_data.tagged_user.tag}\`. (Reason: \`${warn_reason}\`, Strikes: \`${num_of_warnings}\` => \`${(num_of_warnings + 1)}\`)`).catch(e => { command_data.global_context.logger.api_error(e); });
        command_data.global_context.bot.emit("guildMemberWarn", { member: command_data.tagged_member, moderator: command_data.msg.author, reason: warn_reason });
    }
};