const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'slap',
    category: 'Actions',
    description: 'Slaps the tagged person-',
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getSlapGifs())

        //Construct embed
        var embedSlap = {
            title: `${data.authorTag} slaps ${data.bot.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedSlap }).catch(e => { console.log(e); });
    },
};