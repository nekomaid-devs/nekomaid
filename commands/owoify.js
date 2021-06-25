const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "owoify",
    category: "Fun",
    description: "Makes NekoMaid say something with a lot of uwus and owos (/-\\)-",
    helpUsage: "[text]`",
    exampleUsage: "please i need help",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("me", "MANAGE_MESSAGES")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        if(command_data.server_config.sayCommand == false) {
            return;
        }

        //Argument check
        if(command_data.args.length < 1) {
            command_data.msg.reply("You need to type in what do you me to owoify-");
            return;
        }

        if(data.msg.mentions.members.size > 0 || data.msg.mentions.roles.size > 0 || data.msg.mentions.everyone === true) {
            command_data.msg.reply("Please remove all mentions before trying again-");
            return;
        }

        var text = data.msg.content;
        if(text.includes("@everyone") || text.includes("@here")) {
            command_data.msg.reply("Please remove all mentions before trying again-");
            return;
        }

        var badWords = ["nigga", "nigger"]
        var passed = true;
        badWords.forEach(badWord => {
            if(passed === true && text.includes(badWord) === true) {
                command_data.msg.reply("I'm not saying that, sorry-");
                passed = false;
            }
        })

        if(passed === true) {
            //Send message
            var owoifiedText = await data.bot.neko.sfw.OwOify({ text: data.msg.content.substring(data.msg.content.indexOf(" ") + 1) });
            command_data.msg.channel.send(owoifiedText.owo).catch(e => { console.log(e); });
            data.msg.delete().catch(e => { console.log(e); });
        }
    },
};