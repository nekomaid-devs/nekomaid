const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "steal",
    category: "Profile",
    description: "Steals credits from other people-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.tagged_user.id === command_data.msg.author.id) {
            command_data.msg.reply(`You can't steal from yourself silly-`);
            return;
        }

        var end = new Date();
        var start = new Date(command_data.author_config.lastStealTime);
        
        var endNeeded = new Date(start.getTime() + (3600000 * 6));
        var timeLeft = endNeeded - end;

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 360) {
            command_data.msg.reply("You need to wait more `" + command_data.global_context.neko_modules_clients.tc.convertTime(timeLeft) + "` before doing this-");
            return;
        }

        command_data.author_config.lastStealTime = end.toUTCString();

        //Gets a random credit ammount
        var minCredits = 0;
        var maxCredits = Math.round((command_data.tagged_user_config.credits / 100) * command_data.global_context.bot_config.stealPercentage);
        var creditsAmmount = Math.floor((Math.random() * (maxCredits - minCredits + 1)) + minCredits);
        creditsAmmount = creditsAmmount > command_data.global_context.bot_config.maxStealCredits ? command_data.global_context.bot_config.maxStealCredits : creditsAmmount;

        //Changes credits and saves
        command_data.author_config.credits += creditsAmmount;
        command_data.author_config.netWorth += creditsAmmount;
        command_data.tagged_user_config.credits -= creditsAmmount;
        command_data.tagged_user_config.netWorth -= creditsAmmount;

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct embed
        let embedSteal = {
            color: 8388736,
            description: "You stole `" + creditsAmmount + "💵` from `" + command_data.tagged_user.tag + "` (Current Credits: `" + command_data.author_config.credits + "$`)"
        }

        //Construct message and send it
        console.log("[steal] Added " + creditsAmmount + " credits to " + command_data.msg.author.tag + " earned by stealing on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedSteal }).catch(e => { console.log(e); });
    },
};