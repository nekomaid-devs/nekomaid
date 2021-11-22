/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_8ball_answers } from "../scripts/utils/vars";
import { pick_random } from "../scripts/utils/general";

export default {
    name: "8ball",
    category: "Fun",
    description: "Answers the given question.",
    helpUsage: "[question]`",
    exampleUsage: "Am I cute?",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a question.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let question = command_data.total_argument;
        if (question.endsWith("?") === false) {
            question += "?";
        }

        const answer = pick_random(get_8ball_answers());
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
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };

        command_data.message.channel.send({ embeds: [embed8Ball] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
