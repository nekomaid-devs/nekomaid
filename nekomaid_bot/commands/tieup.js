const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'tieup',
    category: 'Actions',
    description: 'Ties up the tagged person-',
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: true,
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getTieupGifs())

        //Construct embed
        var embedTieUp = {
            title: `${data.authorTag} ties up ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedTieUp }).catch(e => { console.log(e); });
    },
};