const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'kill',
    category: 'Actions',
    description: 'Kills the tagged person-',
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
        var isAllowed = true;
        data.taggedUsers.forEach(function(user) {
            if(user.id === data.authorUser.id) {
                isAllowed = false;
            }
        });

        if(isAllowed === false) {
            data.reply(`Let's not do that ;-;`);
            return;
        }

        //Get random gif
        var gif = data.bot.pickRandom(data.bot.vars.getKillGifs())

        //Construct embed
        var embedKill = {
            title: `${data.authorTag} kills ${data.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: gif
            }
        }

        //Send message
        data.channel.send("", { embed: embedKill }).catch(e => { console.log(e); });
    },
};