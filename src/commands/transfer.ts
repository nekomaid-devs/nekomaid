/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "transfer",
    category: "Profile",
    description: "Transfers credits to another user.",
    helpUsage: "[mention] [amount/all/half/%]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: ["pay"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true), new Argument(2, "You need to type in an amount.", "int>0/all/half", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.message.author.id === command_data.tagged_user.id) {
            command_data.message.reply("You can't transfer credits to yourself.");
            return;
        }

        let credits_amount = parseInt(command_data.args[1]);
        if (command_data.args[1] === "all") {
            if (command_data.user_data.credits <= 0) {
                command_data.message.reply("You don't have enough credits to do this.");
                return;
            }
            credits_amount = command_data.user_data.credits;
        } else if (command_data.args[1] === "half") {
            if (command_data.user_data.credits <= 1) {
                command_data.message.reply("You don't have enough credits to do this.");
                return;
            }
            credits_amount = Math.round(command_data.user_data.credits / 2);
        } else if (command_data.args[1].includes("%")) {
            if (credits_amount > 0 && credits_amount <= 100) {
                credits_amount = Math.round(command_data.user_data.credits * (credits_amount / 100));
                if (credits_amount < 1 || command_data.user_data.credits <= 0) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }
            } else {
                command_data.message.reply("Invalid percentage amount.");
                return;
            }
        }

        if (command_data.user_data.credits - credits_amount < 0) {
            command_data.message.reply("You don't have enough credits to do this.");
            return;
        }

        command_data.user_data.credits -= credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        command_data.tagged_user_data.credits += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.tagged_user_data);

        const embedTransfer = {
            color: 8388736,
            description: `Transfered \`${format_number(credits_amount)} 💵\` from \`${command_data.message.author.tag}\` to \`${command_data.tagged_user.tag}\`! (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
        };
        command_data.message.channel.send({ embeds: [embedTransfer] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
