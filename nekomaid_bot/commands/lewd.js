module.exports = {
    name: 'lewd',
    category: 'Emotes',
    description: 'Posts a lewd reaction gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getLewdGifs())

        //Construct embed
        var embedLewd = {
            title: `${data.authorTag} thinks thats lewd!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedLewd }).catch(e => { console.log(e); });
    },
};