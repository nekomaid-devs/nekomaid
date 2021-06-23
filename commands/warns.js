const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'warns',
    category: 'Moderation',
    description: 'Displays warnings of tagged user-',
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
    execute(data) {
        //Get server config
        var warns = data.serverWarns.filter(warn =>
            warn.userID === data.taggedUser.id
        )

        //Construct embed
        const embedWarns = new data.bot.Discord.MessageEmbed()
        .setColor(8388736)
        .setAuthor('❯ Warnings for ' + data.taggedUserTag + ' (' + warns.length + ')', data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 }));

        warns.slice(-3).forEach((warn, index) => {
            var end = Date.now()
            var elapsedTime = data.bot.tc.convertTime(end - warn.start)

            embedWarns.addField("Warn #" + (warns.length - index), "Warned for - " + warn.reason + " (" + elapsedTime + " ago)");
        });

        data.channel.send("", { embed: embedWarns }).catch(e => { console.log(e); });
    }
}