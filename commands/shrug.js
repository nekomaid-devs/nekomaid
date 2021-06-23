module.exports = {
    name: 'shrug',
    category: 'Emotes',
    description: 'Posts a shrugging gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getShrugGifs())

        //Construct embed
        var embedShrug = {
            title: `${data.authorTag} shrugs!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedShrug }).catch(e => { console.log(e); });
    },
};