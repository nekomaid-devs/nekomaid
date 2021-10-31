/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";

export default {
    name: "roll",
    category: "Fun",
    description: "Rolls a dice- Also makes it possible to win credits by betting.",
    helpUsage: "[numberOfSides?] [result?] [bet?]` *(all arguments optional)*",
    exampleUsage: "6 2 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a number of sides.", "int>0"),
        new RecommendedArgument(2, "Argument needs to be a predicted result.", "int>0"),
        new RecommendedArgument(3, "Argument needs to be a bet amount.", "int>0/all/half"),
    ],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let roll_type = 6;
        if (command_data.args.length > 0) {
            roll_type = parseInt(command_data.args[0]);
        }
        const options: any[] = [];
        for (let i = 1; i <= roll_type; i++) {
            options.push(i);
        }

        const embedRoll: any = {
            title: `${command_data.msg.author.tag} is rolling...`,
            color: 8388736,
        };

        if (command_data.args.length > 2) {
            const bet_result = parseInt(command_data.args[1]);
            if (options.includes(bet_result) === false) {
                command_data.msg.reply(`Invalid \`bet_result\` for \`roll\`- (${options[0]}-${options[options.length - 1]})`);
                return;
            }

            let credits_amount = parseInt(command_data.args[2]);
            if (command_data.args[2] === "all") {
                if (command_data.author_user_config.credits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_amount = command_data.author_user_config.credits;
                }
            } else if (command_data.args[2] === "half") {
                if (command_data.author_user_config.credits <= 1) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_amount = Math.round(command_data.author_user_config.credits / 2);
                }
            } else if (command_data.args[2].includes("%")) {
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
            if (roll_type !== 6) {
                command_data.msg.reply(`You can only bet on a 6-sided dice.`);
                return;
            }

            const message = await command_data.msg.channel.send({ embeds: [embedRoll] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (message === null) {
                return;
            }
            setTimeout(() => {
                const result = command_data.global_context.utils.pick_random(options);
                embedRoll.title = `${command_data.msg.author.tag} rolled ${result}!`;

                if (result === bet_result) {
                    const multiplier = 0.55 + (options.length - 1) / 5;
                    const multiplier_text = (1 + multiplier).toFixed(2);
                    const won_amount = Math.floor(credits_amount * multiplier);
                    const won_amount_text = command_data.global_context.utils.format_number(credits_amount + won_amount);

                    command_data.author_user_config.credits += won_amount;
                    command_data.author_user_config.net_worth += won_amount;
                    command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

                    embedRoll.description = `You won \`${won_amount_text}\` credits!`;
                    embedRoll.footer = {
                        text: `Win multiplier: ${multiplier_text}x`,
                    };
                } else {
                    const lost_amount_text = command_data.global_context.utils.format_number(credits_amount);

                    command_data.author_user_config.credits -= credits_amount;
                    command_data.author_user_config.net_worth -= credits_amount;
                    command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

                    embedRoll.description = `You lost \`${lost_amount_text}\` credits...`;
                }

                message.edit({ embeds: [embedRoll] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }, 750);
        } else {
            const result = command_data.global_context.utils.pick_random(options);
            embedRoll.title = `${command_data.msg.author.tag} rolled ${result}!`;
            command_data.msg.channel.send({ embeds: [embedRoll] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
