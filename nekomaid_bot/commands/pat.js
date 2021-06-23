const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'pat',
    category: 'Actions',
    description: 'Pats the tagged person-',
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
        var gif = data.bot.pickRandom(data.bot.vars.getPatGifs())

        //Construct embed
        var embedPat = {
            title: `${data.authorTag} pats ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedPat }).catch(e => { console.log(e); });
    },
};