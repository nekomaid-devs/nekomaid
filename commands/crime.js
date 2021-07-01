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
        let end = new Date();
        let start = new Date(command_data.author_config.lastCrimeTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 180) {
            let end_needed = new Date(start.getTime() + (3600000 * 3));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convertTime(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.lastCrimeTime = end.toUTCString();

        let min_credits = command_data.global_context.bot_config.minCrimeCredits;
        let max_credits = command_data.global_context.bot_config.maxCrimeCredits;
        let credits_ammount = Math.floor((Math.random() * (max_credits - min_credits + 1)) + min_credits);

        let chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if(chance <= command_data.global_context.bot_config.crimeSuccessChance) {
            answers = command_data.global_context.bot_config.crimeSuccessAnswers;
        } else {
            answers = command_data.global_context.bot_config.crimeFailedAnswers;
            answer_color = 15483730;
            creditsAmmount = -creditsAmmount;
        }
        
        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<creditsAmmount>", "`" + credits_ammount + "💵`");

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.netWorth += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedCrime = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${command_data.author_config.credits}$\`)`,
            footer: {
                text: `Make sure to vote with ${command_data.server_config.prefix}vote for free credits`
            }
        }
        command_data.msg.channel.send("", { embed: embedCrime }).catch(e => { console.log(e); });
    },
};