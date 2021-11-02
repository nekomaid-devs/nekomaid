/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import { get_8ball_answers } from "../scripts/utils/util_vars";

export default {
    name: "8ball",
    category: "Fun",
    description: "Answers the given question.",
    helpUsage: "[question]`",
    exampleUsage: "Am I cute?",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in a question.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let question = command_data.total_argument;
        if (question.endsWith("?") === false) {
            question += "?";
        }

        const answer = command_data.global_context.utils.pick_random(get_8ball_answers());
        const embed8Ball = {
            title: "🎱 | 8Ball",
            color: 8388736,
            fields: [
                {
                    name: "Question:",
                    value: `${question}`,
                },
                {
                    name: "Answer:",
                    value: `${answer}`,
                },
            ],
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };

        command_data.msg.channel.send({ embeds: [embed8Ball] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
