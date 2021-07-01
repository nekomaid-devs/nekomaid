module.exports = {
    name: "work",
    category: "Profile",
    description: "Gets credits earned by working-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let end = new Date();
        let start = new Date(command_data.author_config.lastWorkTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 180) {
            let end_needed = new Date(start.getTime() + (3600000 * 3));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.lastWorkTime = end.toUTCString();

        let min_credits = command_data.global_context.bot_config.minWorkCredits;
        let max_credits = command_data.global_context.bot_config.maxWorkCredits;
        let credits_ammount = Math.floor(((Math.random() * (max_credits - min_credits + 1)) + min_credits) * 1);

        let answers = command_data.global_context.bot_config.workAnswers;
        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<creditsAmmount>", "`" + credits_ammount + "💵`");

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.netWorth += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedWork = {
            color: 6732650,
            description: `${answer} (Current Credits: \`${command_data.author_config.credits}$\`)`,
            footer: {
                text: `Make sure to vote with ${command_data.server_config.prefix}vote for free credits`
            }
        }
        command_data.msg.channel.send("", { embed: embedWork }).catch(e => { console.log(e); });
    },
};