const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'say',
    category: 'Utility',
    description: 'Makes NekoMaid say something-',
    helpUsage: "[text]`",
    exampleUsage: "please i need help",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in what do you want me to say-", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("me", "MANAGE_MESSAGES")
    ],
    nsfw: false,
    execute(data) {
        if(data.serverConfig.sayCommand == false) {
            return;
        }

        if(data.msg.mentions.members.size > 0 || data.msg.mentions.roles.size > 0 || data.msg.mentions.everyone === true) {
            data.reply("Please remove all mentions before trying again-");
            return;
        }

        var text = data.msg.content;
        if(text.includes("@everyone") || text.includes("@here")) {
            data.reply("Please remove all mentions before trying again-");
            return;
        }

        var badWords = ["nigga", "nigger"]
        var passed = true;
        badWords.forEach(badWord => {
            if(passed === true && text.includes(badWord) === true) {
                data.reply("I'm not saying that, sorry-");
                passed = false;
            }
        })

        if(passed === true) {
            //Send message
            data.channel.send(data.msg.content.substring(data.msg.content.indexOf(" ") + 1)).catch(e => { console.log(e); });
            data.msg.delete().catch(e => { console.log(e); });
        }
    },
};