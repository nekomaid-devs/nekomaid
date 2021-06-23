module.exports = {
    name: 'work',
    category: 'Profile',
    description: 'Gets credits earned by working-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        var end = new Date();
        var start = new Date(data.authorConfig.lastWorkTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 3));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 180) {
                data.reply("You need to wait more `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
                return;
        }

        data.authorConfig.lastWorkTime = end.toUTCString();

        //Get reputation bonus
        var topRep = await data.bot.sb.updateTop(data.bot, ["rep"]);
        var multiplier = 1;
        var i2 = 10;
        for(let i = 0; i < 10; i += 1) {
            const userConfig = topRep.items[i];

            if(data.authorUser.id === userConfig.userID) {
                multiplier += i2 / 10;
            }

            i2 -= 1;
        }

        //Gets a random credit ammount
        var minCredits = data.botConfig.minWorkCredits;
        var maxCredits = data.botConfig.maxWorkCredits;
        var creditsAmmount = Math.floor(((Math.random() * (maxCredits - minCredits + 1)) + minCredits) * multiplier);

        //Gets a random answer
        var answers = data.botConfig.workAnswers;
        var answer = data.bot.pickRandom(answers);

        //Edits the answer to correspond with the creditAmmount
        answer = answer.replace("<creditsAmmount>", "`" + creditsAmmount + "💵`");

        //Changes credits and saves
        data.authorConfig.credits += creditsAmmount;
        data.authorConfig.netWorth += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct message and send it
        var embedWork = {
            color: 6732650,
            description: answer + " (Current Credits: `" + data.authorConfig.credits + "$`)",
            footer: {
                text: "Reputation multiplier: " + multiplier + "x | Make sure to vote with " + data.serverConfig.prefix + "vote for free credits"
            }
        }

        console.log("[work] Added " + creditsAmmount + " credits to " + data.authorTag + " earned by working on Server(id: " + data.guild.id + ")");
        data.channel.send("", { embed: embedWork }).catch(e => { console.log(e); });
    },
};