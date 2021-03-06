/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { pick_random, format_number } from "../scripts/utils/general";

export default {
    name: "coinflip",
    category: "Profile",
    description: "Flips a coin. Also makes it possible to win credits by betting.",
    helpUsage: "[amount/all/half/%?] [heads/tails?]` *(both argument optional)*",
    exampleUsage: "100 tails",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a bet amount.", "int>0/all/half", false), new Argument(2, "Argument needs to be heads/tails.", "heads/tails", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const options = ["heads", "tails"];
        const result = pick_random(options);

        if (command_data.args.length > 0) {
            const bet_result = command_data.args.length > 1 ? command_data.args[1].toLowerCase() : "heads";
            let credits_amount = parseInt(command_data.args[0]);
            if (command_data.args[0] === "all") {
                if (command_data.user_data.credits <= 0) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }
                credits_amount = command_data.user_data.credits;
            } else if (command_data.args[0] === "half") {
                if (command_data.user_data.credits <= 1) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }
                credits_amount = Math.round(command_data.user_data.credits / 2);
            } else if (command_data.args[0].includes("%")) {
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

            const embedCoinflipLoading = {
                title: `${command_data.message.author.tag} is flipping...`,
                color: 8388736,
            };
            const message = await command_data.message.channel.send({ embeds: [embedCoinflipLoading] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (message === null) {
                return null;
            }

            setTimeout(() => {
                let result_text = "";
                if (result === bet_result) {
                    const won_amount = Math.floor(credits_amount * 0.75);
                    const won_amount_text = `You won ${format_number(credits_amount + won_amount)} credits!`;

                    command_data.user_data.credits += won_amount;
                    command_data.user_data.net_worth += won_amount;
                    command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);
                    result_text = won_amount_text;
                } else {
                    const lost_amount_text = `You lost ${format_number(credits_amount)} credits...`;

                    command_data.user_data.credits -= credits_amount;
                    command_data.user_data.net_worth -= credits_amount;
                    command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);
                    result_text = lost_amount_text;
                }

                const embedCoinflip = {
                    title: `${command_data.message.author.tag} flipped ${result}!`,
                    color: 8388736,
                    description: result_text,
                    footer:
                        result === bet_result
                            ? {
                                  text: "Win multiplier: 1.75x",
                              }
                            : undefined,
                };
                message.edit({ embeds: [embedCoinflip] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }, 750);
        } else {
            const embedCoinflip = {
                title: `${command_data.message.author.tag} flipped ${result}!`,
                color: 8388736,
            };
            command_data.message.channel.send({ embeds: [embedCoinflip] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
