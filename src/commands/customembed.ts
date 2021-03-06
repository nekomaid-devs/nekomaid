/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "customembed",
    category: "Utility",
    description: "Returns result of an embed json",
    helpUsage: "[json]`",
    exampleUsage: "{'title':'Test'}",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a JSON string to construct embed from.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let custom_embed;
        try {
            custom_embed = JSON.parse(command_data.total_argument);
        } catch (e: any) {
            const embedError = {
                title: "<:n_error:771852301413384192> Error when parsing the JSON!",
                description: `\`\`\`${e}\`\`\``,
            };

            command_data.message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        command_data.message.channel.send({ embeds: [custom_embed] }).catch((e) => {
            command_data.message.channel.send(`Error when creating the embed!\n\`${e}\``).catch((err) => {
                command_data.global_context.logger.api_error(err);
            });
        });
    },
} as Command;
