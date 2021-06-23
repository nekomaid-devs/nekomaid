const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'unban',
    category: 'Moderation',
    description: 'Unbans the tagged user-',
    helpUsage: "[username]`",
    exampleUsage: "/username/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an username (ex. `LamkasDev` or `LamkasDev#4235`)-")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(data) {
        //Get server config
        var usernames = []
        var banInfo = -1

        var taggedUserDisplayName = data.totalArgument;
        data.guild.fetchBans().then(serverBansResult => {
            serverBansResult.forEach(ban => {
                var taggedUserDisplayNameModded = taggedUserDisplayName.endsWith("#" + ban.user.discriminator) ? taggedUserDisplayName : taggedUserDisplayName + "#" + ban.user.discriminator
                if(ban.user.username + "#" + ban.user.discriminator === taggedUserDisplayNameModded) {
                    usernames.push(ban.user.username + "#" + ban.user.discriminator)
                    banInfo = ban
                }
            });

            if(usernames.length > 1) {
                data.reply("There are more than 1 user with this discriminator, so you need to specify which one (" + usernames + ")-");
            } else if(usernames.length < 1) {
                data.reply("`" + taggedUserDisplayName + "` isn't banned-");
            } else {
                data.guild.members.unban(banInfo.user, "None").catch(err => {
                    console.error(err);
                    data.reply("Couldn't unban `" + banInfo.user.username + "#" + banInfo.user.discriminator + "` (Try moving Nekomaid's permissions above the user you want to unban-")
                })

                var previousBan = -1;
                data.serverBans.forEach(function(ban) {
                    if(ban.userID === banInfo.user.id) {
                        previousBan = ban;
                    }
                });

                data.channel.send("Unbanned `" + banInfo.user.username + "#" + banInfo.user.discriminator + "`-").catch(e => { console.log(e); });
                
                if(previousBan != -1) {
                    data.bot.lastModeratorIDs.set(data.guild.id, data.authorUser.id);
                    data.bot.ssm.server_remove.removeServerBan(data.bot.ssm, previousBan.id);
                }
            }
        })
    }
};