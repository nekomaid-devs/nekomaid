/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "poll",
    category: "Utility",
    description: "Creates a poll.",
    helpUsage: '"[question]" "[option1?]" "[option2?] ..."`',
    exampleUsage: '"Does pineapple belong on pizza?" "Yes!" "No..."',
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a question.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const a = (command_data.total_argument.match(/"/g) || []).length;
        if (a === 0 || a % 2 !== 0) {
            command_data.message.channel.send("Check your syntax before trying to create a poll again!").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        let total_argument = command_data.total_argument;
        let parts = [];
        while ((total_argument.match(/"/g) || []).length > 0) {
            const b = total_argument.indexOf('"') + '"'.length;
            const part = total_argument.substring(b, total_argument.indexOf('"', b));
            total_argument = total_argument.slice(part.length + b + 1);

            parts.push(part);
        }

        if (parts.length > 11) {
            command_data.message.channel.send("Maximum number of answers is `10`!").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        } else if (parts.length === 1) {
            parts = [parts.shift(), "A", "B", "C"];
        }

        const question = parts.shift();
        const description = parts.reduce((acc, curr, i) => {
            acc += `**${i + 1})** ${curr}\n`;
            return acc;
        }, "");

        const embedPoll = {
            title: `<:n_poll:771902338646278174> Poll: ${question}`,
            description: description,
        };
        const message = await command_data.message.channel.send({ embeds: [embedPoll] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }
        const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        parts.forEach((part, i) => {
            message.react(reactions[i]).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        });
    },
} as Command;
