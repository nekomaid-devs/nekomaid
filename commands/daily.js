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
    execute(command_data) {
        let end = new Date();
        let start = new Date(command_data.author_config.lastDailyTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= (60 * 60);
        diff = Math.abs(Math.round(diff));

        if(diff < 24) {
            let end_needed = new Date(start.getTime() + (3600000 * 24));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.lastDailyTime = end.toUTCString();

        command_data.author_config.credits += command_data.global_context.bot_config.dailyCredits;
        command_data.author_config.netWorth += command_data.global_context.bot_config.dailyCredits;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedDaily = {
            color: 6732650,
            description: `Picked up daily reward of \`${command_data.global_context.bot_config.dailyCredits} 💵\`! (Current Credits: \`${command_data.author_config.credits}$\`)`,
            footer: {
                text: "Make sure to vote with " + command_data.server_config.prefix + "vote for free credits"
            }
        }
        command_data.msg.channel.send("", { embed: embedDaily }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};