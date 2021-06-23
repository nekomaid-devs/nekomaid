module.exports = {
    name: 'kiss',
    category: 'Actions',
    description: 'Kisses the tagged person-',
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getKissGifs())

        //Construct embed
        var embedKiss = {
            title: `${data.authorTag} kisses ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedKiss }).catch(e => { console.log(e); });
    },
};