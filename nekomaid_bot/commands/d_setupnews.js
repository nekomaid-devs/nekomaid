const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'd_setupnews',
    category: 'Testing',
    description: 'Construct all news messages',
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(data) {
        var embedListed =    {
            title: "Listed Websites",
            description: "1) <:n_online:725010541352976414>[top.gg](https://top.gg/bot/691398095841263678) (#4,2k)\n2) <:n_online:725010541352976414>[bots.ondiscord.xyz](https://bots.ondiscord.xyz/bots/691398095841263678) (#130k)\n3) <:n_online:725010541352976414>[botsfordiscord.com](https://botsfordiscord.com/bot/691398095841263678) (#138k)\n4) <:n_online:725010541352976414>[discord.bots.gg](https://discord.bots.gg/bots/691398095841263678) (#159k)\n5) <:n_online:725010541352976414>[discordbotlist.com](https://discordbotlist.com/bots/nekomaid) (#219k)\n6) <:n_online:725010541352976414>[discord.boats](https://discord.boats/bot/691398095841263678) (#233k)\n7) <:n_online:725010541352976414>[botlist.space](https://botlist.space/bot/691398095841263678) (#1,4M)\n8) <:n_online:725010541352976414>[glennbotlist.xyz](https://glennbotlist.xyz/bot/691398095841263678) (#3,6M)"
        }

        var embedUpvote = {
            title: "Where to upvote?",
            description: "1) [top.gg](https://top.gg/bot/691398095841263678/vote) - 2k for upvoting <:awauBlush:723634891014668382>\n2) [botsfordiscord.com](https://botsfordiscord.com/bot/691398095841263678/vote) - 1,5k for upvoting <:awauBlush:723634891014668382>\n3) [discordbotlist.com](https://discordbotlist.com/bots/nekomaid/upvote) - 1,5k for upvoting <:awauBlush:723634891014668382>\n4) [discord.boats](https://discord.boats/bot/691398095841263678/vote) - 1k for upvoting <:awauBlush:723634891014668382>\n5) [botlist.space](https://botlist.space/bot/691398095841263678/upvote) - 500$ for upvoting <:awauBlush:723634891014668382>"
        }

        var embedSite =    {
            title: "Bot Website",
            description: "[nekomaid.xyz](https://nekomaid.xyz) - <:PikaHeart:721870039925522433>"
        }

        data.channel.send("", { embed: embedListed }).catch(e => { console.log(e); });
        data.channel.send("", { embed: embedUpvote }).catch(e => { console.log(e); });
        data.channel.send("", { embed: embedSite }).catch(e => { console.log(e); });
    },
};