const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "steal",
    category: "Profile",
    description: "Steals credits from other people.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.tagged_user.id === command_data.msg.author.id) {
            command_data.msg.reply("You can't steal from yourself silly-");
            return;
        }

        let end = new Date();
        let start = new Date(command_data.author_config.lastStealTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 360) {
            let end_needed = new Date(start.getTime() + (3600000 * 6));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.lastStealTime = end.toUTCString();

        var min_credits = 0;
        var max_credits = Math.round((command_data.tagged_user_config.credits / 100) * command_data.global_context.bot_config.stealPercentage);
        var credits_ammount = Math.floor((Math.random() * (max_credits - min_credits + 1)) + min_credits);
        credits_ammount = credits_ammount > command_data.global_context.bot_config.maxStealCredits ? command_data.global_context.bot_config.maxStealCredits : credits_ammount;

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.netWorth += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.tagged_user_config.credits -= credits_ammount;
        command_data.tagged_user_config.netWorth -= credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        let embedSteal = {
            color: 8388736,
            description: `You stole \`${credits_ammount} 💵\` from \`${command_data.tagged_user.tag}\` (Current Credits: \`${command_data.author_config.credits}$\`)`
        }
        command_data.msg.channel.send("", { embed: embedSteal }).catch(e => { console.log(e); });
    },
};