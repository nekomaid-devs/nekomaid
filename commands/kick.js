const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'kick',
    category: 'Moderation',
    description: 'Kicks the tagged user-',
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
    execute(data) {
        if(data.taggedMember.kickable === false) {
            data.reply("Couldn't kick `" + data.taggedUserTag + "` (Try moving Nekomaid's permissions above the user you want to kick)-");
            return;
        }

        var kickReason = "None";
        if(data.args.length > 1) {
            kickReason = data.msg.content.substring(data.msg.content.indexOf(data.args[1]) + data.args[1].length + 1)
        }

        data.channel.send("Kicked `" + data.taggedUserTag + "` (Reason: `" + kickReason + "`)-").catch(e => { console.log(e); });

        data.bot.lastModeratorIDs.set(data.guild.id, data.authorUser.id);
        data.taggedMember.kick(kickReason);
    }
};