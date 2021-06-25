const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kicks the tagged user-",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/userTag/ Breaking rules",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.tagged_member.kickable === false) {
            command_data.msg.reply("Couldn't kick `" + command_data.tagged_user.tag + "` (Try moving Nekomaid's permissions above the user you want to kick)-");
            return;
        }

        var kickReason = "None";
        if(command_data.args.length > 1) {
            kickReason = data.msg.content.substring(data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1)
        }

        command_data.msg.channel.send("Kicked `" + command_data.tagged_user.tag + "` (Reason: `" + kickReason + "`)-").catch(e => { console.log(e); });

        data.bot.lastModeratorIDs.set(command_data.msg.guild.id, data.authorUser.id);
        command_data.tagged_member.kick(kickReason);
    }
};