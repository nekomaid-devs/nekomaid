module.exports = {
    name: 'blush',
    category: 'Emotes',
    description: 'Posts a blushing gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getBlushGifs())

        //Construct embed
        var embedBlush = {
            title: `${data.authorTag} is blushing!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedBlush }).catch(e => { console.log(e); });
    },
};