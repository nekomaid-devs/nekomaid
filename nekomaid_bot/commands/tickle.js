const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'tickle',
    category: 'Actions',
    description: 'Tickles the tagged person-',
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getTickleGifs())

        //Construct embed
        var embedTickle = {
            title: `${data.authorTag} tickles ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedTickle }).catch(e => { console.log(e); });
    },
};