const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'cuddle',
    category: 'Actions',
    description: 'Cuddles the tagged person!',
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
        var gif = data.bot.pickRandom(data.bot.vars.getCuddleGifs())

        //Construct embed
        var embedKiss = {
            title: `${data.authorTag} cuddles ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedKiss }).catch(e => { console.log(e); });
    },
};