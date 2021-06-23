const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'steal',
    category: 'Profile',
    description: 'Steals credits from other people-',
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
        if(data.taggedUser.id === data.authorUser.id) {
            data.reply(`You can't steal from yourself silly-`);
            return;
        }

        var end = new Date();
        var start = new Date(data.authorConfig.lastStealTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 6));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 360) {
            data.reply("You need to wait more `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastStealTime = end.toUTCString();

        //Gets a random credit ammount
        var minCredits = 0;
        var maxCredits = Math.round((data.taggedUserConfig.credits / 100) * data.botConfig.stealPercentage);
        var creditsAmmount = Math.floor((Math.random() * (maxCredits - minCredits + 1)) + minCredits);
        creditsAmmount = creditsAmmount > data.botConfig.maxStealCredits ? data.botConfig.maxStealCredits : creditsAmmount;

        //Changes credits and saves
        data.authorConfig.credits += creditsAmmount;
        data.authorConfig.netWorth += creditsAmmount;
        data.taggedUserConfig.credits -= creditsAmmount;
        data.taggedUserConfig.netWorth -= creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct embed
        var embedSteal = {
            color: 8388736,
            description: "You stole `" + creditsAmmount + "💵` from `" + data.taggedUserTag + "` (Current Credits: `" + data.authorConfig.credits + "$`)"
        }

        //Construct message and send it
        console.log("[steal] Added " + creditsAmmount + " credits to " + data.authorTag + " earned by stealing on Server(id: " + data.guild.id + ")");
        data.channel.send("", { embed: embedSteal }).catch(e => { console.log(e); });
    },
};