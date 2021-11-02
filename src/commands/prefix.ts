/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
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
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.args.length < 1) {
            const embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Current prefix is ",
                        value: command_data.server_config.prefix,
                    },
                ],
                footer: {
                    text: `to change the prefix type \`${command_data.server_config.prefix}prefix <newPrefix>\`)`,
                },
            };
            command_data.msg.channel.send({ embeds: [embedPrefix] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            if (command_data.total_argument.length > 10) {
                command_data.msg.reply("Prefix can't be longer than 10 characters!");
                return;
            }

            command_data.server_config.prefix = command_data.total_argument;
            command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "server", server: command_data.server_config });

            const embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Set bot's prefix to",
                        value: command_data.server_config.prefix,
                    },
                ],
            };
            command_data.msg.channel.send({ embeds: [embedPrefix] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
