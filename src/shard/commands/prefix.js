const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");
const { Permissions } = require("discord.js-light");

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
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a new prefix.", "none")],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        if (command_data.args.length < 1) {
            let embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Current prefix is ",
                        value: command_data.server_config.prefix,
                    },
                ],
                footer: `to change the prefix type \`${command_data.server_config.prefix}prefix <newPrefix>\`)`,
            };
            command_data.msg.channel.send({ embeds: [embedPrefix] }).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            if (command_data.total_argument.length > 10) {
                command_data.msg.reply("Prefix can't be longer than 10 characters!");
                return;
            }

            command_data.server_config.prefix = command_data.total_argument;
            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", server: command_data.server_config });

            let embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Set bot's prefix to",
                        value: command_data.server_config.prefix,
                    },
                ],
            };
            command_data.msg.channel.send({ embeds: [embedPrefix] }).catch((e) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
