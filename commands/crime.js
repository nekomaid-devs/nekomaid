module.exports = {
    name: "crime",
    category: "Profile",
    description: "Gets or loses credits by doing crimes-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var end = new Date();
        var start = new Date(data.authorConfig.lastCrimeTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 3));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 180) {
            command_data.msg.reply("You need to wait more `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastCrimeTime = end.toUTCString();

        //Gets a random credit ammount
        var minCredits = command_data.global_context.bot_config.minCrimeCredits;
        var maxCredits = command_data.global_context.bot_config.maxCrimeCredits;

        var creditsAmmount = Math.floor((Math.random() * (maxCredits - minCredits + 1)) + minCredits);
        var creditsAmmountDisplay = creditsAmmount;

        //Gets a random state of crime
        var chance = Math.floor(Math.random() * 100) + 1;
        var option = chance <= command_data.global_context.bot_config.crimeSuccessChance ? "success" : "failure";

        //Get a random answer depending on crime success
        var answers = -1;
        var answerColor = 6732650;

        switch(option) {
            case "success":
                answers = command_data.global_context.bot_config.crimeSuccessAnswers;
                break;

            case "failure":
                answers = command_data.global_context.bot_config.crimeFailedAnswers;
                answerColor = 15483730;
                creditsAmmount = -creditsAmmount;
                break;
        }
        
        var answer = command_data.global_context.utils.pick_random(answers);

        //Edits the answer to correspond with the creditAmmount
        answer = answer.replace("<creditsAmmount>", "`" + creditsAmmountDisplay + "💵`");

        //Changes credits and saves
        data.authorConfig.credits += creditsAmmount;
        data.authorConfig.netWorth += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct embed
        var credits = data.authorConfig.credits;

        let embedCrime = {
            color: answerColor,
            description: answer + " (Current Credits: `" + credits + "$`)",
            footer: {
                text: "Make sure to vote with " + command_data.server_config.prefix + "vote for free credits"
            }
        }

        //Construct message and send it
        console.log("[crime] Added " + creditsAmmount + " credits to " + command_data.msg.author.tag + " earned by doing crimes on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedCrime }).catch(e => { console.log(e); });
    },
};