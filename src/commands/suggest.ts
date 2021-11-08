/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "suggest",
    category: "Help & Information",
    description: "Suggests a feature.",
    helpUsage: "[suggestion]`",
    exampleUsage: "Add X/Improve X",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a suggestion.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        command_data.message.channel.send("Suggestion sent! Thanks for the feedback ❤️!").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        const user = await command_data.global_context.bot.users.fetch(command_data.global_context.config.owner_id).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (user === null) {
            return;
        }
        const embedSuggestion = {
            title: `Suggestion from \`${command_data.message.author.tag}\``,
            description: command_data.total_argument,
        };
        user.send({ embeds: [embedSuggestion] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
