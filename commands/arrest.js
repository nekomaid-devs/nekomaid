const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'arrest',
    category: 'Actions',
    description: 'Arrests the tagged person-',
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
        var gif = data.bot.pickRandom(data.bot.vars.getArrestGifs())

        //Construct embed
        var suffix = data.taggedUsers.length === 1 ? "is" : "are";
        var embedArrest = {
            title: `${data.taggedUserTags} ${suffix} getting arrested!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedArrest }).catch(e => { console.log(e); });
    },
};