const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "bans",
    category: "Moderation",
    description: "Displays all bans on this server-",
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
    execute(command_data) {
        let now = Date.now();
        let embedBans = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor(`❯ Bans (${command_data.serverBans.length})`, command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 }));

        if(command_data.serverBans.length < 1) {
            command_data.msg.channel.send("", { embed: embedBans }).catch(e => { console.log(e); });
            return;
        }

        let serverBansByID = new Map();
        command_data.msg.guild.fetchBans().then(serverBansResult => {
            serverBansResult.forEach(ban => {
                serverBansByID.set(ban.user.id, ban);
            });

            command_data.serverBans.slice(-25).forEach(ban => {
                let bannedMember = serverBansByID.get(ban.userID);
                if(bannedMember !== undefined) {
                    let remainingText = ban.end === -1 ? "Forever" : command_data.tc.convertTime(ban.end - now);
                    embedBans.addField(`Ban - ${bannedMember.user.tag}`, `Remaining: \`${remainingText}\``);
                }
            });
        
            command_data.msg.channel.send("", { embed: embedBans }).catch(e => { console.log(e); });
        })
    },
};