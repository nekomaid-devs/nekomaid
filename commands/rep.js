const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "rep",
    category: "Profile",
    description: "Adds a reputation point to the tagged user-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Argument check
        if(command_data.tagged_user.id === data.authorUser.id) {
            command_data.msg.reply("You can't give reputation to yourself-");
            return;
        }

        //Get the author's config, check for timeout and update the timeout
        var end = new Date();
        var start = new Date(data.authorConfig.lastRepTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 1));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 60) {
            command_data.msg.reply("You need to wait `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastRepTime = end.toUTCString();

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Get tagged user's config and changes rep value
        command_data.tagged_user_config.rep += 1;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct message and send it
        console.log("[rep] Added rep to " + command_data.tagged_user.tag + " on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("Added `1` reputation to `" + command_data.tagged_user.tag + "`! (Current reputation: `" + command_data.tagged_user_config.rep + "`)").catch(e => { console.log(e); });
    },
};