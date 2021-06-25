module.exports = {
    name: "beg",
    category: "Profile",
    description: "Gets credits by begging from other people-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Get author's config, check for timeout and update the timeout
        var end = new Date();
        var start = new Date(data.authorConfig.lastBegTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 1));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 60) {
            data.msg.reply("You need to wait more `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastBegTime = end.toUTCString();

        //Gets a random credit ammount
        var minCredits = command_data.global_context.bot_config.minBegCredits;
        var maxCredits = command_data.global_context.bot_config.maxBegCredits;

        var creditsAmmount = Math.floor((Math.random() * (maxCredits - minCredits + 1)) + minCredits);
        var creditsAmmountDisplay = creditsAmmount;

        //Gets a random state of crime
        var chance = Math.floor(Math.random() * 100) + 1;
        var option = chance <= command_data.global_context.bot_config.begSuccessChance ? "success" : "failure";

        //Get a random answer depending on crime success
        var answers = -1;
        var answerColor = 6732650;

        switch(option) {
            case "success":
                answers = command_data.global_context.bot_config.begSuccessAnswers;
                break;

            case "failure":
                answers = command_data.global_context.bot_config.begFailedAnswers;
                answerColor = 15483730;
                creditsAmmount = 0;
                break;
        }

        var answer = command_data.global_context.utils.pick_random(answers);

        //Get a random user
        var members = command_data.msg.guild.members.cache;
        var member = command_data.global_context.utils.pick_random(Array.from(members.values()));

        //Edits the answer to correspond with the creditAmmount
        answer = answer.replace("<creditsAmmount>", "`" + creditsAmmountDisplay + "💵`");
        answer = answer.replace("<user>", "`" + member.user.username + "#" + member.user.discriminator + "`");

        //Changes credits and saves
        data.authorConfig.credits += creditsAmmount;
        data.authorConfig.netWorth += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });
        
        //Construct embed
        var credits = data.authorConfig.credits;

        let embedBeg = {
            color: answerColor,
            description: answer + " (Current Credits: `" + credits + "$`)",
            footer: {
                text: "Make sure to vote with " + command_data.server_config.prefix + "vote for free credits"
            }
        }

        //Construct message and send it
        console.log("[beg] Added " + creditsAmmount + " credits to " + command_data.msg.author.tag + " earned by begging on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedBeg }).catch(e => { console.log(e); });
    },
};