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
        // TODO: re-factor command
        //Get random option
        var options = [ "heads", "tails" ];
        var result = command_data.global_context.utils.pick_random(options);

        //Construct embed
        let embedCoinflip = {
            title: `${command_data.msg.author.tag} flipped ${result}!`,
            color: 8388736
        }

        if(command_data.args.length > 0) {
            var betResult = command_data.args.length > 1 ? command_data.args[1].toLowerCase() : "heads";
            var betAmmount = parseInt(command_data.args[0]);

            if(typeof(betResult) != "string" || options.includes(betResult) === false) {
                data.msg.reply("Invalid `betResult` for `coinflip`- (" + options + ")");
                return;
            }

            //Check author's config
            var authorCredits = data.authorConfig.credits;

            if(command_data.args[0] === "all") {
                if(authorCredits <= 0) {
                    data.msg.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = authorCredits;
                }
            } else if(command_data.args[0] === "half") {
                if(authorCredits <= 1) {
                    data.msg.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = Math.round(authorCredits / 2);
                }
            } else if(isNaN(betAmmount) || betAmmount <= 0) {
                data.msg.reply("Invalid `betAmmount` for `coinflip`- (number)");
                return;
            }

            if(data.authorConfig.credits < betAmmount) {
                data.msg.reply(`You don't have enough credits to do this-`);
                return;
            }

            if(result === betResult) {
                var wonAmmount = Math.floor(betAmmount * 0.75);
                var wonAmmountText = betAmmount + wonAmmount;
                data.authorConfig.credits += wonAmmount;
                data.authorConfig.netWorth += wonAmmount;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

                //Construct message and send it
                embedCoinflip.description = "You won `" + wonAmmountText + "` credits-";
                embedCoinflip.footer = {
                    text: "Win multiplier: 1.75x"
                }
            } else {
                data.authorConfig.credits -= betAmmount;
                data.authorConfig.netWorth -= betAmmount;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

                //Construct message and send it
                embedCoinflip.description = "You lost `" + betAmmount + "` credits-";
            }

            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { console.log(e); });
        } else {
            command_data.msg.channel.send("", { embed: embedCoinflip }).catch(e => { console.log(e); });
        }
    },
};