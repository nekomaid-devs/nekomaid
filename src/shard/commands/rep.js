const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "rep",
    category: "Profile",
    description: "Adds a reputation point to the tagged user.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention an user.", "mention")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        if (command_data.tagged_user.id === command_data.msg.author.id) {
            command_data.msg.reply("You can't give reputation to yourself!");
            return;
        }

        let end = new Date();
        let start = new Date(command_data.author_config.last_rep_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 180) {
            let end_needed = new Date(start.getTime() + 3600000 * 3);
            let time_left = (end_needed - end) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_config.last_rep_time = end.getTime();
        command_data.author_config.notifications.push({
            id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
            user_ID: command_data.msg.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You gave reputation to \`${command_data.tagged_user.tag}\`.`,
        });
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

        command_data.tagged_user_config.rep += 1;
        command_data.tagged_user_config.notifications.push({
            id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
            user_ID: command_data.tagged_user.id,
            timestamp: Date.now(),
            description: `<time_ago> You were given reputation by \`${command_data.msg.author.tag}\`.`,
        });
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.tagged_user_config });

        command_data.msg.channel.send(`Added \`1\` reputation to \`${command_data.tagged_user.tag}\`! (Current reputation: \`${command_data.tagged_user_config.rep}\`)`).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
