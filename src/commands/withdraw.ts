/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "withdraw",
    category: "Profile",
    description: "Transfers credits from bank to user.",
    helpUsage: "[amount/all/half/%]`",
    exampleUsage: "100",
    hidden: false,
    aliases: ["with"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an amount", "int>0/all/half", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let credits_amount = parseInt(command_data.args[0]);
        if (command_data.args[0] === "all") {
            if (command_data.user_data.bank <= 0) {
                command_data.message.reply("Your bank account doesn't have enough credits to do this.");
                return;
            }
            credits_amount = command_data.user_data.bank;
        } else if (command_data.args[0] === "half") {
            if (command_data.user_data.bank <= 1) {
                command_data.message.reply("Your bank account doesn't have enough credits to do this.");
                return;
            }
            credits_amount = Math.round(command_data.user_data.bank / 2);
        } else if (command_data.args[0].includes("%")) {
            if (credits_amount > 0 && credits_amount <= 100) {
                credits_amount = Math.round(command_data.user_data.bank * (credits_amount / 100));
                if (credits_amount < 1 || command_data.user_data.bank <= 0) {
                    command_data.message.reply("Your bank account doesn't have enough credits to do this.");
                    return;
                }
            } else {
                command_data.message.reply("Invalid percentage amount.");
                return;
            }
        }

        if (command_data.user_data.bank - credits_amount < 0) {
            command_data.message.reply("You don't have enough credits in bank to do this.");
            return;
        }

        command_data.user_data.bank -= credits_amount;
        command_data.user_data.credits += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const embedWithdraw = {
            color: 8388736,
            description: `Withdrew \`${format_number(credits_amount)} 💵\` from bank to \`${command_data.message.author.tag}\`! (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
        };
        command_data.message.channel.send({ embeds: [embedWithdraw] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
