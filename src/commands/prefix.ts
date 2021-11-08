/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "prefix",
    category: "Help & Information",
    description: "Displays the current prefix of the bot or changes it- (max. of 10 characters)",
    helpUsage: "[?newPrefix]` *(optional argument)*",
    exampleUsage: ".",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a new prefix.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.args.length < 1) {
            const embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Current prefix is ",
                        value: command_data.guild_data.prefix,
                    },
                ],
                footer: {
                    text: `to change the prefix type \`${command_data.guild_data.prefix}prefix <newPrefix>\`)`,
                },
            };
            command_data.message.channel.send({ embeds: [embedPrefix] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            if (command_data.total_argument.length > 10) {
                command_data.message.reply("Prefix can't be longer than 10 characters!");
                return;
            }

            command_data.guild_data.prefix = command_data.total_argument;
            command_data.global_context.neko_modules_clients.db.edit_guild(command_data.guild_data);

            const embedPrefix = {
                title: "",
                color: 8388736,
                fields: [
                    {
                        name: "Set bot's prefix to",
                        value: command_data.guild_data.prefix,
                    },
                ],
            };
            command_data.message.channel.send({ embeds: [embedPrefix] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
