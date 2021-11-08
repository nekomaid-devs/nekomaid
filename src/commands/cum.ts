/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "cum",
    category: "NSFW",
    description: "Sends a random lewd cum image.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: true,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const url = await command_data.global_context.modules.akaneko.nsfw.cum().catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        const embedCum = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url,
            },
            footer: {
                text: "Powered by Akaneko 💖",
            },
        };

        command_data.message.channel.send({ embeds: [embedCum] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
