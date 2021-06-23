module.exports = {
    name: 'dance',
    category: 'Emotes',
    description: 'Posts a dancing gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getDanceGifs())

        //Construct embed
        var embedDance = {
            title: `${data.authorTag} is dancing!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedDance }).catch(e => { console.log(e); });
    },
};