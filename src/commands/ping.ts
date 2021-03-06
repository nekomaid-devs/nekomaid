/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "ping",
    category: "Help & Information",
    description: "Checks the bot's ping",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const message = await command_data.message.channel.send("Ping?").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }

        const embedPing = {
            color: 8388736,
            fields: [
                {
                    name: "🏓 Ping",
                    value: `${message.createdTimestamp - command_data.message.createdTimestamp}ms`,
                },
                {
                    name: "🏠 API",
                    value: `${Math.round(command_data.global_context.bot.ws.ping)}ms`,
                },
            ],
        };

        message.edit({ embeds: [embedPing] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
