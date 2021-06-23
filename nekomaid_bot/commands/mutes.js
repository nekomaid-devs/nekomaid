const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'mutes',
    category: 'Moderation',
    description: 'Displays all mutes on this server-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(data) {
        //Get server config
        var now = Date.now();

        //Construct embed
        const embedMutes = new data.bot.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor('❯ Mutes (' + data.serverMutes.length + ')', data.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }));

        if(data.serverMutes.length < 1) {
            data.channel.send("", { embed: embedMutes }).catch(e => { console.log(e); });
            return;
        }

        var loadedMutes = 0;
        var expectedMutes = data.serverMutes.length < 25 ? data.serverMutes.length : 25;
        data.serverMutes.slice(data.serverMutes.length - 25).forEach(async mute => {
            var mutedUser = await data.bot.users.fetch(mute.userID).catch(e => { console.log(e); });

            if(mutedUser !== undefined) {
                var mutedUserDisplayName = mutedUser.username + "#" + mutedUser.discriminator;
                var remainingText = mute.end === -1 ? "Forever" : data.bot.tc.convertTime(mute.end - now);
                embedMutes.addField("Mute - " + mutedUserDisplayName, "Remaining: `" + remainingText + "`");
            }

            loadedMutes += 1;
            if(loadedMutes >= expectedMutes) {
                data.channel.send("", { embed: embedMutes }).catch(e => { console.log(e); });
            }
        });
    },
};