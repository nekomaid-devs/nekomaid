module.exports = {
    name: 'daily',
    category: 'Profile',
    description: 'Gets a daily reward to user-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var end = new Date();
        var start = new Date(data.authorConfig.lastDailyTime);

        var endNeeded = new Date(start.getTime() + 86400000);
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= (60 * 60);
        diff = Math.abs(Math.round(diff));

        if(diff < 24) {
            data.reply("You need to wait `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastDailyTime = end.toUTCString();

        //Changes credits and saves
        data.authorConfig.credits += data.botConfig.dailyCredits;
        data.authorConfig.netWorth += data.botConfig.dailyCredits;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct message and send it
        var credits = data.authorConfig.credits;

        var embedDaily = {
            color: 6732650,
            description: "Added daily reward of `" + data.botConfig.dailyCredits + "💵` to `" + data.authorTag + "`! (Current Credits: `" + credits + "$`)",
            footer: {
                text: "Make sure to vote with " + data.serverConfig.prefix + "vote for free credits"
            }
        }

        console.log("[daily] Added DailyReward of " + data.botConfig.dailyCredits + " credits to " + data.authorTag + " on Server(id: " + data.guild.id + ")");
        data.channel.send("", { embed: embedDaily }).catch(e => { console.log(e); });
    },
};