module.exports = {
    name: 'smug',
    category: 'Emotes',
    description: 'Posts a smugging gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getSmugGifs())

        //Construct embed
        var embedSmug = {
            title: `${data.authorTag} smugs!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedSmug }).catch(e => { console.log(e); });
    },
};