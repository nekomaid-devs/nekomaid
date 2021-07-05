const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "coinflip",
    category: "Fun",
    description: "Flips a coin- Also makes it possible to win credits by betting.",
    helpUsage: "[ammount/all/half?] [heads/tails?]` *(both argument optional)*",
    exampleUsage: "100 tails",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a bet ammount.", "int>0/all/half"),
        new RecommendedArgument(2, "Argument needs to be heads/tails.", "heads/tails")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let options = ["heads", "tails"];
        let result = command_data.global_context.utils.pick_random(options);
        let embedCoinflip = {
            title: `${command_data.msg.author.tag} flipped ${result}!`,
            color: 8388736
        }

        if(command_data.args.length > 0) {
            let bet_result = command_data.args.length > 1 ? command_data.args[1].toLowerCase() : "heads";
            let bet_ammount = parseInt(command_data.args[0]);

            // TODO: add support for %
            let author_credits = command_data.author_config.credits;
            if(command_data.args[0] === "all") {
                if(author_credits <= 0) {
                    command_data.msg.reply("You don't have enough credits to do this-");
                    return;
                } else {
                    bet_ammount = author_credits;
                }
            } else if(command_data.args[0] === "half") {
                if(author_credits <= 1) {
                    command_data.msg.reply("You don't have enough credits to do this-");
                    return;
                } else {
                    bet_ammount = Math.round(author_credits / 2);
                }
            }

            if(command_data.author_config.credits < bet_ammount) {
                command_data.msg.reply("You don't have enough credits to do this-");
                return;
            }

            if(result === bet_result) {
                let won_ammount = Math.floor(bet_ammount * 0.75);
                let won_ammount_text = bet_ammount + won_ammount;

                command_data.author_config.credits += won_ammount;
                command_data.author_config.netWorth += won_ammount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

                embedCoinflip.description = `You won \`${won_ammount_text}\` credits-`;
                embedCoinflip.footer = {
                    text: "Win multiplier: 1.75x"
                }
            } else {
                command_data.author_config.credits -= bet_ammount;
                command_data.author_config.netWorth -= bet_ammount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

                embedCoinflip.description = `You lost \`${bet_ammount}\` credits-`;
            }

            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { command_data.global_context.logger.api_error(e); });
        } else {
            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { command_data.global_context.logger.api_error(e); });
        }
    },
};