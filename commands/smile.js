module.exports = {
    name: 'smile',
    category: 'Emotes',
    description: 'Posts a smiling gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getSmileGifs())

        //Construct embed
        var embedSmile = {
            title: `${data.authorTag} is smiling!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedSmile }).catch(e => { console.log(e); });
    },
};