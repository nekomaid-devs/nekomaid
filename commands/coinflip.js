module.exports = {
    name: "coinflip",
    category: "Fun",
    description: "Flips a coin- Also makes it possible to win credits by betting-",
    helpUsage: "[bet?] [heads/tails?]` *(both argument optional)*",
    exampleUsage: "100 tails",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let options = [ "heads", "tails" ];
        let result = command_data.global_context.utils.pick_random(options);
        let embedCoinflip = {
            title: `${command_data.msg.author.tag} flipped ${result}!`,
            color: 8388736
        }

        if(command_data.args.length > 0) {
            let bet_result = command_data.args.length > 1 ? command_data.args[1].toLowerCase() : "heads";
            let bet_ammount = parseInt(command_data.args[0]);

            if(typeof(bet_result) != "string" || options.includes(bet_result) === false) {
                command_data.msg.reply(`Invalid \`betResult\` for \`coinflip\`- (${options})`);
                return;
            }

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
            } else if(isNaN(bet_ammount) || bet_ammount <= 0) {
                command_data.msg.reply(`Invalid \`betAmmount\` for \`coinflip\`- (number)`);
                return;
            }

            if(command_data.author_config.credits < bet_ammount) {
                command_data.msg.reply("You don't have enough credits to do this-");
                return;
            }

            if(result === bet_result) {
                let won_ammount = Math.floor(betAmmount * 0.75);
                let won_ammount_text = betAmmount + won_ammount;

                command_data.author_config.credits += won_ammount;
                command_data.author_config.netWorth += won_ammount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

                embedCoinflip.description = `You won \`${won_ammount_text}\` credits-`;
                embedCoinflip.footer = {
                    text: "Win multiplier: 1.75x"
                }
            } else {
                command_data.author_config.credits -= betAmmount;
                command_data.author_config.netWorth -= betAmmount;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

                embedCoinflip.description = `You lost \`${betAmmount}\` credits-`;
            }

            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { console.log(e); });
        } else {
            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { console.log(e); });
        }
    },
};