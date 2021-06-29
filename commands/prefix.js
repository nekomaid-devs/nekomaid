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
        if(command_data.args.length < 1) {
            let embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Current prefix is ",
                        value: command_data.server_config.prefix
                    }
                ],
                footer: `to change the prefix type \`${command_data.server_config.prefix}prefix <newPrefix>\`)`
            }
            command_data.msg.channel.send("", { embed: embedPrefix }).catch(e => { console.log(e); });
        } else {
            if(command_data.total_argument.length > 10) {
                command_data.msg.reply("Prefix can't be longer than 10 characters-");
                return;
            }

            command_data.server_config.prefix = command_data.total_argument;
            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

            let embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Set bot's prefix to",
                        value: command_data.server_config.prefix
                    }
                ]
            }
            command_data.msg.channel.send("", { embed: embedPrefix }).catch(e => { console.log(e); });
        }
    },
};