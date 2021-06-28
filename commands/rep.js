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
        if(command_data.tagged_user.id === command_data.msg.author.id) {
            command_data.msg.reply("You can't give reputation to yourself-");
            return;
        }

        let end = new Date();
        let start = new Date(command_data.author_config.lastStealTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(diff < 180) {
            let end_needed = new Date(start.getTime() + (3600000 * 3));
            let time_left = end_needed - end;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules_clients.tc.convertTime(time_left)}\` before doing this-`);
            return;
        }

        command_data.author_config.lastRepTime = end.toUTCString();
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.tagged_user_config.rep += 1;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });
        
        command_data.msg.channel.send(`Added \`1\` reputation to \`${command_data.tagged_user.tag}\`! (Current reputation: \`${command_data.tagged_user_config.rep}\`)`).catch(e => { console.log(e); });
    },
};