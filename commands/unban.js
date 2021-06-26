const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "unban",
    category: "Moderation",
    description: "Unbans the tagged user-",
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
    execute(command_data) {
        // TODO: re-factor command
        //Get server config
        var usernames = []
        var banInfo = -1

        var taggedUserDisplayName = command_data.total_argument;
        command_data.msg.guild.fetchBans().then(serverBansResult => {
            serverBansResult.forEach(ban => {
                var taggedUserDisplayNameModded = taggedUserDisplayName.endsWith("#" + ban.user.discriminator) ? taggedUserDisplayName : taggedUserDisplayName + "#" + ban.user.discriminator
                if(ban.user.username + "#" + ban.user.discriminator === taggedUserDisplayNameModded) {
                    usernames.push(ban.user.username + "#" + ban.user.discriminator)
                    banInfo = ban
                }
            });

            if(usernames.length > 1) {
                command_data.msg.reply("There are more than 1 user with this discriminator, so you need to specify which one (" + usernames + ")-");
            } else if(usernames.length < 1) {
                command_data.msg.reply("`" + taggedUserDisplayName + "` isn't banned-");
            } else {
                command_data.msg.guild.members.unban(banInfo.user, "None").catch(err => {
                    console.error(err);
                    command_data.msg.reply("Couldn't unban `" + banInfo.user.username + "#" + banInfo.user.discriminator + "` (Try moving Nekomaid's permissions above the user you want to unban-")
                })

                var previousBan = -1;
                data.serverBans.forEach(function(ban) {
                    if(ban.userID === banInfo.user.id) {
                        previousBan = ban;
                    }
                });

                command_data.msg.channel.send("Unbanned `" + banInfo.user.username + "#" + banInfo.user.discriminator + "`-").catch(e => { console.log(e); });
                
                if(previousBan != -1) {
                    data.bot.lastModeratorIDs.set(command_data.msg.guild.id, command_data.msg.author.id);
                    command_data.global_context.neko_modules_clients.ssm.server_remove.removeServerBan(command_data.global_context.neko_modules_clients.ssm, previousBan.id);
                }
            }
        })
    }
};