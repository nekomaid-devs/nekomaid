module.exports = {
    name: 'pout',
    category: 'Emotes',
    description: 'Posts a pouting gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getPoutGifs())

        //Construct embed
        var embedPout = {
            title: `${data.authorTag} is pouting!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedPout }).catch(e => { console.log(e); });
    },
};