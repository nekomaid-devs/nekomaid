import { CommandData } from "../ts/types";

import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "withdraw",
    category: "Profile",
    description: "Transfers credits from bank to user.",
    helpUsage: "[amount/all/half/%]`",
    exampleUsage: "100",
    hidden: false,
    aliases: ["with"],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in an amount", "int>0/all/half")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let credits_amount = parseInt(command_data.args[0]);
        if (command_data.args[0] === "all") {
            if (command_data.author_user_config.bank <= 0) {
                command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                return;
            } else {
                credits_amount = command_data.author_user_config.bank;
            }
        } else if (command_data.args[0] === "half") {
            if (command_data.author_user_config.bank <= 1) {
                command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                return;
            } else {
                credits_amount = Math.round(command_data.author_user_config.bank / 2);
            }
        } else if (command_data.args[0].includes("%")) {
            if (credits_amount > 0 && credits_amount <= 100) {
                credits_amount = Math.round(command_data.author_user_config.bank * (credits_amount / 100));
                if (credits_amount < 1 || command_data.author_user_config.bank <= 0) {
                    command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                    return;
                }
            } else {
                command_data.msg.reply(`Invalid percentage amount.`);
                return;
            }
        }

        if (command_data.author_user_config.bank - credits_amount < 0) {
            command_data.msg.reply(`You don't have enough credits in bank to do this.`);
            return;
        }

        command_data.author_user_config.bank -= credits_amount;
        command_data.author_user_config.credits += credits_amount;
        command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

        const embedWithdraw = {
            color: 8388736,
            description: `Withdrew \`${command_data.global_context.utils.format_number(credits_amount)} 💵\` from bank to \`${command_data.msg.author.tag}\`! (Current Credits: \`${command_data.global_context.utils.format_number(
                command_data.author_user_config.credits
            )}$\`)`,
        };
        command_data.msg.channel.send({ embeds: [embedWithdraw] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
