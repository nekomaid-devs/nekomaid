module.exports = {
    name: 'osu',
    category: 'Utility',
    description: 'Shows osu! stats-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        if(data.authorConfig.osuUsername === "-1") {
            data.reply("You haven't set an osu! profile yet- Set it by typing `" + data.serverConfig.prefix + "osuset <username>`-")
            return;
        }

        var user = await data.bot.osu.getUser({ u: data.authorConfig.osuUsername }).catch(e => { console.log(e); });
        if(user.id === undefined) {
            data.reply("No osu! profile found- Try setting a new one with `" + data.serverConfig.prefix + "osuset <username>`-");
            return;
        }

        //Construct embed
        var embedOsu = {
            color: 8388736,
            author: {
                name: `osu! stats for ${data.authorConfig.osuUsername}`,
                icon_url: "http://s.ppy.sh/a/" + user.id,
                url: "https://osu.ppy.sh/users/" + user.id
            },
            description: "**▸ Rank:** #" + user.pp.rank + " (" + user.country + " #" + user.pp.countryRank + ")\n" +
                "**▸ Level:** " + Math.floor(user.level) + " (" + ((user.level - Math.floor(user.level)) * 100).toFixed(2) + "%)\n" +
                "**▸ Total PP:** " + user.pp.raw + "\n" +
                "**▸ Accuracy:** " + parseFloat(user.accuracy).toFixed(2) + "%\n" +
                "**▸ Playcount:** " + user.counts.plays,
            thumbnail: {
                url: "http://s.ppy.sh/a/" + user.id
            },
            footer: {
                text: `Requested by ${data.authorUser.tag}`
            }
        }

        //Send message
        data.channel.send("", { embed: embedOsu }).catch(e => { console.log(e); });
    },
};