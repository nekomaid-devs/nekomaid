const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "prefix",
    category: "Help & Information",
    description: "Displays the current prefix of the bot or changes it- (max. of 10 characters)",
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
    execute(command_data) {
        // TODO: re-factor command
        let embedPrefix = {
            title: "",
            color: 8388736
        }

        if(command_data.args.length < 1) {
            embedPrefix.fields = [ {
                name: "Current prefix is ",
                value: command_data.server_config.prefix
            }]
            embedPrefix.footer = "to change the prefix type `" + command_data.server_config.prefix + "prefix <newPrefix>`)";
        } else {
            //Set prefix
            var newPrefix = data.msg.content.substring((command_data.server_config.prefix + "prefix").length + 1);
            if(newPrefix.length > 10) {
                command_data.msg.reply("Prefix can't be longer than 10 characters-");
                return;
            }

            command_data.server_config.prefix = newPrefix;
            try {
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
            } catch(err) {
                console.error(err);
            }

            embedPrefix.fields = [ {
                name: "Set bot's prefix to",
                value: newPrefix
            }]
        }

        command_data.msg.channel.send("", { embed: embedPrefix }).catch(e => { console.log(e); });
    },
};