const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "warns",
    category: "Moderation",
    description: "Displays warnings of tagged user-",
    helpUsage: "[?mention]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    execute(command_data) {
        let warns = command_data.serverWarns.filter(warn => { return warn.userID === command_data.tagged_user.id });
        let embedWarns = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor(`❯ Warnings for ${command_data.tagged_user.tag} (${warns.length})`, command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 }));

        if(warns.length < 1) {
            command_data.msg.channel.send("", { embed: embedWarns }).catch(e => { console.log(e); });
            return;
        }

        warns.slice(-3).forEach((warn, index) => {
            let end = Date.now()
            let elapsedTime = command_data.global_context.neko_modules_clients.tc.convertTime(end - warn.start)
            embedWarns.addField(`Warn #${(warns.length - index)}`, `Warned for - ${warn.reason} (${elapsedTime} ago)`);
        });

        command_data.msg.channel.send("", { embed: embedWarns }).catch(e => { console.log(e); });
    }
}