module.exports = {
    name: 'cry',
    category: 'Emotes',
    description: 'Posts a crying gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getCryGifs())

        //Construct embed
        var embedCry = {
            title: `${data.authorTag} is crying!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedCry }).catch(e => { console.log(e); });
    },
};