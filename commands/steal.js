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
            command_data.msg.reply("You can't steal from yourself silly~");
            return;
        }

        let end = new Date();
        let start = new Date(command_data.author_config.last_steal_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if(diff < 360) {
            let end_needed = new Date(start.getTime() + (3600000 * 6));
            let time_left = (end_needed - end) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_config.last_steal_time = end.getTime();

        var min_credits = 0;
        var max_credits = Math.round((command_data.tagged_user_config.credits / 100) * [7][0]);
        var credits_ammount = Math.floor((Math.random() * (max_credits - min_credits + 1)) + min_credits);
        credits_ammount = credits_ammount > [500][0] ? [500][0] : credits_ammount;

        command_data.author_config.credits += credits_ammount;
        command_data.author_config.net_worth += credits_ammount;
        command_data.author_config.notifications.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: command_data.msg.author.id, timestamp: Date.now(), description: `<time_ago> You stole \`${command_data.global_context.utils.format_number(credits_ammount)} 💵\` from \`${command_data.tagged_user.tag}\`.` });
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.tagged_user_config.credits -= credits_ammount;
        command_data.tagged_user_config.net_worth -= credits_ammount;
        command_data.tagged_user_config.notifications.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), user_ID: command_data.tagged_user.id, timestamp: Date.now(), description: `<time_ago> You were stolen \`${command_data.global_context.utils.format_number(credits_ammount)} 💵\` by \`${command_data.msg.author.tag}\`.` });
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        let embedSteal = {
            color: 8388736,
            description: `You stole \`${command_data.global_context.utils.format_number(credits_ammount)} 💵\` from \`${command_data.tagged_user.tag}\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`
        }
        command_data.msg.channel.send("", { embed: embedSteal }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};