const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'nom',
    category: 'Actions',
    description: 'Noms the tagged person-',
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
        var gif = data.bot.pickRandom(data.bot.vars.getNomGifs())

        //Construct embed
        var embedNom = {
            title: `${data.authorTag} noms ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedNom }).catch(e => { console.log(e); });
    },
};