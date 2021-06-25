module.exports = {
    name: "daily",
    category: "Profile",
    description: "Gets a daily reward to user-",
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
        var start = new Date(data.authorConfig.lastDailyTime);

        var endNeeded = new Date(start.getTime() + 86400000);
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= (60 * 60);
        diff = Math.abs(Math.round(diff));

        if(diff < 24) {
            command_data.msg.reply("You need to wait `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastDailyTime = end.toUTCString();

        //Changes credits and saves
        data.authorConfig.credits += command_data.global_context.bot_config.dailyCredits;
        data.authorConfig.netWorth += command_data.global_context.bot_config.dailyCredits;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct message and send it
        var credits = data.authorConfig.credits;

        let embedDaily = {
            color: 6732650,
            description: "Added daily reward of `" + command_data.global_context.bot_config.dailyCredits + "💵` to `" + command_data.msg.author.tag + "`! (Current Credits: `" + credits + "$`)",
            footer: {
                text: "Make sure to vote with " + command_data.server_config.prefix + "vote for free credits"
            }
        }

        console.log("[daily] Added DailyReward of " + command_data.global_context.bot_config.dailyCredits + " credits to " + command_data.msg.author.tag + " on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedDaily }).catch(e => { console.log(e); });
    },
};