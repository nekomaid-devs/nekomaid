import { CommandData } from "../ts/types";
import RecommendedArgument from "../scripts/helpers/recommended_argument";

export default {
    name: "coinflip",
    category: "Profile",
    description: "Flips a coin. Also makes it possible to win credits by betting.",
    helpUsage: "[amount/all/half/%?] [heads/tails?]` *(both argument optional)*",
    exampleUsage: "100 tails",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a bet amount.", "int>0/all/half"), new RecommendedArgument(2, "Argument needs to be heads/tails.", "heads/tails")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const options = ["heads", "tails"];
        const embedCoinflip: any = {
            title: `${command_data.msg.author.tag} is flipping...`,
            color: 8388736,
        };

        if (command_data.args.length > 0) {
            const bet_result = command_data.args.length > 1 ? command_data.args[1].toLowerCase() : "heads";
            let credits_amount = parseInt(command_data.args[0]);
            if (command_data.args[0] === "all") {
                if (command_data.author_user_config.credits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_amount = command_data.author_user_config.credits;
                }
            } else if (command_data.args[0] === "half") {
                if (command_data.author_user_config.credits <= 1) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_amount = Math.round(command_data.author_user_config.credits / 2);
                }
            } else if (command_data.args[0].includes("%")) {
                if (credits_amount > 0 && credits_amount <= 100) {
                    credits_amount = Math.round(command_data.author_user_config.credits * (credits_amount / 100));
                    if (credits_amount < 1 || command_data.author_user_config.credits <= 0) {
                        command_data.msg.reply(`You don't have enough credits to do this.`);
                        return;
                    }
                } else {
                    command_data.msg.reply(`Invalid percentage amount.`);
                    return;
                }
            }

            if (command_data.author_user_config.credits - credits_amount < 0) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            }

            const message = await command_data.msg.channel.send({ embeds: [embedCoinflip] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (message === null) { return null; }

            setTimeout(async () => {
                const result = command_data.global_context.utils.pick_random(options);
                embedCoinflip.title = `${command_data.msg.author.tag} flipped ${result}!`;

                if (result === bet_result) {
                    const won_amount = Math.floor(credits_amount * 0.75);
                    const won_amount_text = command_data.global_context.utils.format_number(credits_amount + won_amount);

                    command_data.author_user_config.credits += won_amount;
                    command_data.author_user_config.net_worth += won_amount;
                    command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

                    embedCoinflip.description = `You won \`${won_amount_text}\` credits!`;
                    embedCoinflip.footer = {
                        text: "Win multiplier: 1.75x",
                    };
                } else {
                    const lost_amount_text = command_data.global_context.utils.format_number(credits_amount);
                    command_data.author_user_config.credits -= credits_amount;
                    command_data.author_user_config.net_worth -= credits_amount;
                    command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

                    embedCoinflip.description = `You lost \`${lost_amount_text}\` credits...`;
                }

                message.edit({ embeds: [embedCoinflip] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }, 750);
        } else {
            const result = command_data.global_context.utils.pick_random(options);
            embedCoinflip.title = `${command_data.msg.author.tag} flipped ${result}!`;
            command_data.msg.channel.send({ embeds: [embedCoinflip] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
