module.exports = {
    name: 'angry',
    category: 'Emotes',
    description: 'Posts an angry gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getAngryGifs())

        //Construct embed
        var embedAngry = {
            title: `${data.authorTag} is angry!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedAngry }).catch(e => { console.log(e); });
    },
};