const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
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
        new RecommendedArgument(3, "Argument needs to be a bet ammount.", "int>0/all/half")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let roll_type = 6;
        if(command_data.args.length > 0) {
            roll_type = parseInt(command_data.args[0]);
        }

        let options = [];
        for(let i = 1; i <= roll_type; i++) {
            options.push(i);
        }

        let result = command_data.global_context.utils.pick_random(options);
        let embedRoll = {
            title: `${command_data.msg.author.tag} rolled ${result}!`,
            color: 8388736
        }

        if(command_data.args.length > 2) {
            let bet_result = parseInt(command_data.args[1]);
            if(options.includes(bet_result) === false) {
                command_data.msg.reply(`Invalid \`bet_result\` for \`roll\`- (${options[0]}-${options[options.length - 1]})`);
                return;
            }

            let credits_ammount = parseInt(command_data.args[2]);
            if(command_data.args[2] === "all") {
                if(command_data.author_config.credits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_ammount = command_data.author_config.credits;
                }
            } else if(command_data.args[2] === "half") {
                if(command_data.author_config.credits <= 1) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                } else {
                    credits_ammount = Math.round(command_data.author_config.credits / 2);
                }
            } else if(command_data.args[2].includes("%")) {
                if(credits_ammount > 0 && credits_ammount <= 100) {
                    credits_ammount = Math.round(command_data.author_config.credits * (credits_ammount / 100));
                    if(credits_ammount < 1 || command_data.author_config.credits <= 0) {
                        command_data.msg.reply(`You don't have enough credits to do this.`);
                        return;
                    }
                } else {
                    command_data.msg.reply(`Invalid percentage ammount.`);
                    return;
                }
            }
    
            if(command_data.author_config.credits - credits_ammount < 0) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            }

            if(result === bet_result) {
                let multiplier = 0.55 + ((options.length - 1) / 5);
                let multiplier_text = (1 + multiplier).toFixed(2);
                let won_ammount = Math.floor(credits_ammount * multiplier);
                let won_ammount_text = credits_ammount + won_ammount;
                
                command_data.author_config.credits += won_ammount;
                command_data.author_config.net_worth += won_ammount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

                embedRoll.description = `You won \`${won_ammount_text}\` credits!`;
                embedRoll.footer = {
                    text: `Win multiplier: ${multiplier_text}x`
                }
            } else {
                command_data.author_config.credits -= credits_ammount;
                command_data.author_config.net_worth -= credits_ammount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

                embedRoll.description = `You lost \`${credits_ammount}\` credits...`;
            }

            command_data.msg.channel.send("", { embed: embedRoll }).catch(e => { command_data.global_context.logger.api_error(e); });
        } else {
            command_data.msg.channel.send("", { embed: embedRoll }).catch(e => { command_data.global_context.logger.api_error(e); });
        }
    },
};