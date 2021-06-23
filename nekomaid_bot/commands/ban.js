const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'ban',
    category: 'Moderation',
    description: 'Bans the tagged user-',
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/userTag/ 1h Spamming",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(data) {
        //Argument & Permission check
        var time = data.args.length < 2 ? -1 : (data.args[1] === -1 ? -1 : data.bot.tc.convertString(data.args[1]));
        if(time != -1 && time.status != 1) {
            data.reply("You entered invalid time format (ex. `1d2h3m4s` or `-1`)-");
            return;
        }

        if(data.taggedMember.bannable === false) {
            data.msg.reply("Couldn't ban `" + data.taggedUserTag + "` (Try moving Nekomaid's permissions above the user you want to ban)-");
            return;
        }

        var banReason = "None";
        if(data.args.length > 2) {
            banReason = data.msg.content.substring(data.msg.content.indexOf(data.args[1]) + data.args[1].length + 1)
        }

        //Get server config
        var previousBan = -1;
        data.serverBans.forEach(function(ban) {
            if(ban.userID === data.taggedUser.id) {
                previousBan = ban;
            }
        });

        var banStart = Date.now();
        var banEnd = -1;
        var extendedTime = (time.days * 86400000) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000);
        var extendedTimeText = time === -1 ? "Forever" : data.tc.convertTime(extendedTime);

        if(previousBan === -1) {
            banEnd = banStart + extendedTime;
            const banEndText = time === -1 ? "Forever" : data.bot.tc.convertTime(banEnd - banStart);
            data.channel.send("Banned `" + data.taggedUserTag + "` for `" + extendedTimeText + "` (Reason: `" + banReason + "`, Time: `" + banEndText + "`)-").catch(e => { console.log(e); });
        } else {
            data.msg.reply("`" + data.taggedUserTag + "` is already banned-");
            return;
        }

        //Construct serverBan
        var serverBan = {
            id: data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: data.guild.id,
            userID: data.taggedUser.id,
            start: banStart,
            reason: banReason,
            end: time === -1 ? -1 : banEnd
        }

        data.taggedMember.ban({ reason: banReason });
        data.bot.lastModeratorIDs.set(data.guild.id, data.authorUser.id);
        data.bot.ssm.server_add.addServerBan(data.bot.ssm, serverBan);
    }
};