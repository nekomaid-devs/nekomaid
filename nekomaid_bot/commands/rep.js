const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'rep',
    category: 'Profile',
    description: 'Adds a reputation point to the tagged user-',
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
    execute(data) {
        //Argument check
        if(data.taggedUser.id === data.authorUser.id) {
            data.reply("You can't give reputation to yourself-");
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
            data.reply("You need to wait `" + data.bot.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        data.authorConfig.lastRepTime = end.toUTCString();

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Get tagged user's config and changes rep value
        data.taggedUserConfig.rep += 1;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct message and send it
        console.log("[rep] Added rep to " + data.taggedUserTag + " on Server(id: " + data.guild.id + ")");
        data.channel.send("Added `1` reputation to `" + data.taggedUserTag + "`! (Current reputation: `" + data.taggedUserConfig.rep + "`)").catch(e => { console.log(e); });
    },
};