import { CommandData } from "../ts/types";
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "customembed",
    category: "Utility",
    description: "Returns result of an embed json",
    helpUsage: "[json]`",
    exampleUsage: "{'title':'Test'}",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in a JSON string to construct embed from.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let custom_embed;
        try {
            custom_embed = JSON.parse(command_data.total_argument);
        } catch (err) {
            const embedError = {
                title: "<:n_error:771852301413384192> Error when parsing the JSON!",
                description: "```" + err + "```",
            };

            command_data.msg.channel.send({ embeds: [embedError] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        command_data.msg.channel.send({ embeds: [custom_embed] }).catch((err) => {
            command_data.msg.channel.send(`Error when creating the embed!\n\`${err}\``).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        });
    },
};
