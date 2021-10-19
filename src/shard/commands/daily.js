module.exports = {
    name: "daily",
    category: "Profile",
    description: "Gets a daily reward to user.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let end = new Date();
        let start = new Date(command_data.author_config.last_daily_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60 * 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 24) {
            let end_needed = new Date(start.getTime() + 3600000 * 24);
            let time_left = (end_needed - end) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_config.last_daily_time = end.getTime();

        let credits_amount = [1000][0];
        credits_amount = credits_amount * command_data.global_context.bot_config.daily_multiplier;
        credits_amount = credits_amount * (command_data.global_context.bot_config.shrine_bonus === "daily" ? [1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.25, 1.3, 1.5, 1.5, 1.5][command_data.global_context.bot_config.b_shrine] : 1);
        credits_amount = Math.round(credits_amount);
        command_data.author_config.notifications.push({
            id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
            user_ID: command_data.msg.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You picked up a daily reward of \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`.`,
        });

        command_data.author_config.credits += credits_amount;
        command_data.author_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

        let embedDaily = {
            color: 6732650,
            description: `Picked up daily reward of \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.server_config.prefix}economyguide`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedDaily] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
