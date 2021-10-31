/* Types */
import { CommandData } from "../ts/types";

export default {
    name: "tentacles",
    category: "NSFW",
    description: "Sends a random lewd image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const url = await command_data.global_context.modules.akaneko.nsfw.tentacles().catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        const embedTentacles = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url,
            },
            footer: {
                text: "Powered by Akaneko 💖",
            },
        };

        command_data.msg.channel.send({ embeds: [embedTentacles] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
