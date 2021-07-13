module.exports = {
    name: "crime",
    category: "Profile",
    description: "Gets or loses credits by doing crimes.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.author_config.b_crime_den < 1) {
            command_data.msg.channel.send("You need to build \`Neko's Crime Den\` to do crimes.").catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let end = new Date();
        let start = new Date(command_data.author_config.last_crime_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if(diff < 180) {
            let end_needed = new Date(start.getTime() + (3600000 * 3));
            let time_left = (end_needed - end) / command_data.global_context.bot_config.speed;
            command_data.msg.channel.send(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this.`).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        command_data.author_config.last_crime_time = end.getTime();

        let min_credits = [0, 250, 350, 400, 500, 550, 675, 700, 750, 950, 1100][command_data.author_config.b_crime_den];
        let max_credits = [0, 300, 375, 425, 550, 650, 700, 725, 850, 1000, 1250][command_data.author_config.b_crime_den];
        let credits_ammount = ((Math.random() * (max_credits - min_credits + 1)) + min_credits);

        let chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if(chance <= [0, 50, 55, 60, 66, 70, 70, 70, 75, 75, 80][command_data.author_config.b_crime_den]) {
            answers = command_data.global_context.bot_config.crime_success_answers;
            command_data.author_config.notifications.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: command_data.msg.author.id, timestamp: Date.now(), description: `<time_ago> You did some crime and got \`${command_data.global_context.utils.format_number(credits_ammount)} 💵\`.` });
        } else {
            answers = command_data.global_context.bot_config.crime_failed_answers;
            answer_color = 15483730;
            credits_ammount = 0;
            command_data.author_config.notifications.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: command_data.msg.author.id, timestamp: Date.now(), description: `<time_ago> You did some crime, but failed.` });
        }
        credits_ammount = credits_ammount * command_data.global_context.bot_config.crime_multiplier;
        credits_ammount = credits_ammount * (command_data.global_context.bot_config.shrine_bonus === "crime" ? [1, 1.01, 1.01, 1.03, 1.05, 1.07, 1.10, 1.10, 1.15, 1.15, 1.15][command_data.global_context.bot_config.b_shrine] : 1);
        credits_ammount = Math.round(credits_ammount * [1, 1.01, 1.03, 1.05, 1.10, 1.15, 1.20, 1.22, 1.25, 1.25, 1.25][command_data.global_context.bot_config.b_crime_monopoly]);
        
        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<credits_ammount>", "`" + command_data.global_context.utils.format_number(credits_ammount) + "💵`");

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.net_worth += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedCrime = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.server_config.prefix}economyguide`
            }
        }
        command_data.msg.channel.send("", { embed: embedCrime }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};