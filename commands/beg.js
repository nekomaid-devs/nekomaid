module.exports = {
    name: "beg",
    category: "Profile",
    description: "Gets credits by begging from other people.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let end = new Date();
        let start = new Date(command_data.author_config.last_beg_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 60) {
            let end_needed = new Date(start.getTime() + (3600000 * 1));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.last_beg_time = end.getTime();

        let min_credits = command_data.global_context.bot_config.min_beg_credits;
        let max_credits = command_data.global_context.bot_config.max_beg_credits;
        let credits_ammount = Math.floor((Math.random() * (max_credits - min_credits + 1)) + min_credits);

        let chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if(chance <= command_data.global_context.bot_config.beg_success_chance) {
            answers = command_data.global_context.bot_config.beg_success_answers;
        } else {
            answers = command_data.global_context.bot_config.beg_failed_answers;
            answer_color = 15483730;
            creditsAmmount = -credits_ammount;
        }
        
        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<creditsAmmount>", "`" + credits_ammount + "💵`");

        let member = command_data.global_context.utils.pick_random(Array.from(command_data.msg.guild.members.cache.values()));
        answer = answer.replace("<user>", "`" + member.user.tag + "`");

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.net_worth += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedBeg = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${command_data.author_config.credits}$\`)`,
            footer: {
                text: `Make sure to vote with ${command_data.server_config.prefix}vote for free credits`
            }
        }
        command_data.msg.channel.send("", { embed: embedBeg }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};