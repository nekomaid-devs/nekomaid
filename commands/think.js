module.exports = {
    name: 'think',
    category: 'Emotes',
    description: 'Posts a thinking gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getThinkGifs())

        //Construct embed
        var embedThink = {
            title: `${data.authorTag} is thinking!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedThink }).catch(e => { console.log(e); });
    },
};