const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes the tagged user.",
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
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "MANAGE_ROLES")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        if(command_data.tagged_user.bannable === false) {
            command_data.msg.reply(`Couldn't unmute \`${command_data.tagged_user.tag}\`! (Try moving Nekomaid's permissions above the user you want to unmute)`);
            return;
        }

        let unmute_reason = "None";
        if(command_data.args.length > 1) {
            unmute_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]))
        }

        let previous_mute = command_data.server_mutes.find(e => { return e.user_ID === command_data.tagged_user.id; });
        if(previous_mute === undefined) {
            command_data.msg.reply(`\`${command_data.tagged_user.tag}\` isn't muted-`);
        } else {
            if(command_data.msg.guild.roles.cache.has(command_data.server_config.mute_role_ID) === false) {
                command_data.msg.reply("Couldn't find the Muted role! (Did somebody delete it?)");
                return;
            }
            
            let mute_role = await command_data.msg.guild.roles.fetch(command_data.server_config.mute_role_ID).catch(e => { command_data.global_context.logger.api_error(e); });
            command_data.tagged_member.roles.remove(mute_role);

            command_data.msg.channel.send(`Unmuted \`${command_data.tagged_user.tag}\`. (Reason: \`${unmute_reason}\`)`).catch(e => { command_data.global_context.logger.api_error(e); });
            command_data.global_context.bot.emit("guildMemberMuteRemove", { member: command_data.tagged_member, moderator: command_data.msg.author, reason: unmute_reason, previous_mute: previous_mute });
        }
    }
};