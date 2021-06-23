const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'prefix',
    category: 'Help & Information',
    description: 'Displays the current prefix of the bot or changes it- (max. of 10 characters)',
    helpUsage: "[?newPrefix]` *(optional argument)*",
    exampleUsage: ".",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    execute(data) {
        var embedPrefix = {
            title: ``,
            color: 8388736
        }

        if(data.args.length < 1) {
            embedPrefix.fields = [ {
                name: "Current prefix is ",
                value: data.serverConfig.prefix
            }]
            embedPrefix.footer = "to change the prefix type `" + data.serverConfig.prefix + "prefix <newPrefix>`)";
        } else {
            //Set prefix
            var newPrefix = data.msg.content.substring((data.serverConfig.prefix + "prefix").length + 1);
            if(newPrefix.length > 10) {
                data.reply("Prefix can't be longer than 10 characters-");
                return;
            }

            data.serverConfig.prefix = newPrefix;
            try {
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });
            } catch(err) {
                console.error(err);
            }

            embedPrefix.fields = [ {
                name: "Set bot's prefix to",
                value: newPrefix
            }]
        }

        data.channel.send("", { embed: embedPrefix }).catch(e => { console.log(e); });
    },
};