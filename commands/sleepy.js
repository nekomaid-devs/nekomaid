module.exports = {
    name: 'sleepy',
    category: 'Emotes',
    description: 'Posts a sleepy gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getSleepyGifs())

        //Construct embed
        var embedSleepy = {
            title: `${data.authorTag} is sleepy!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedSleepy }).catch(e => { console.log(e); });
    },
};