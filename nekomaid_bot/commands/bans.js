const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'bans',
    category: 'Moderation',
    description: 'Displays all bans on this server-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(data) {
        //Get server config
        var now = Date.now();

        //Construct embed
        const embedBans = new data.bot.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor('❯ Bans (' + data.serverBans.length + ')', data.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }));

        if(data.serverBans.length < 1) {
            data.channel.send("", { embed: embedBans }).catch(e => { console.log(e); });
            return;
        }

        var serverBansByID = new Map();
        data.guild.fetchBans().then(serverBansResult => {
            serverBansResult.forEach(ban => {
                serverBansByID.set(ban.user.id, ban);
            })

            data.serverBans.slice(-25).forEach(ban => {
                var bannedUser = serverBansByID.get(ban.userID);

                if(bannedUser !== undefined) {
                    var bannedUserDisplayName = bannedUser.user.username + "#" + bannedUser.user.discriminator;
                    var remainingText = ban.end === -1 ? "Forever" : data.tc.convertTime(ban.end - now);
                    embedBans.addField("Ban - " + bannedUserDisplayName, "Remaining: `" + remainingText + "`");
                }
            });
        
            data.channel.send("", { embed: embedBans }).catch(e => { console.log(e); });
        })
    },
};