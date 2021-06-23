module.exports = {
    name: 'borgar',
    category: 'Actions',
    description: 'borgar-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getBorgarGifs())

        //Construct embed
        var embedBorgar = {
            title: `${data.authorTag} eats a borgar-`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedBorgar }).catch(e => { console.log(e); });
    },
};