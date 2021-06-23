module.exports = {
    name: 'roll',
    category: 'Fun',
    description: 'Rolls a dice- Also makes it possible to win credits by betting-',
    helpUsage: "[numberOfSides?] [result?] [bet?]` *(all arguments optional)*",
    exampleUsage: "6 2 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Get roll type
        var rollType = 6;
        if(data.args.length > 0) {
            rollType = parseInt(data.args[0]);
        }

        //Get options set
        var options = [];
        switch(rollType) {
            default:
                if(isNaN(rollType) || rollType <= 1) {
                    data.reply("Invalid `numberOfSides` for `roll`- (number more than 1)");
                    return;
                } else {
                    for(var i = 1; i <= rollType; i += 1) {
                        options.push(i);
                    }
                }
        }

        //Get random result and image if exists
        var result = data.bot.pickRandom(options);

        //Construct embed
        var embedRoll = {
            title: `${data.authorTag} rolled ${result}!`,
            color: 8388736
        }

        if(data.args.length > 2) {
            var betResult = parseInt(data.args[1]);
            var betAmmount = parseInt(data.args[2]);

            if(isNaN(betResult) || options.includes(betResult) === false) {
                data.reply("Invalid `betResult` for `roll`- (" + options[0] + "-" + options[options.length - 1] + ")");
                return;
            }

            //Check author's config
            var authorCredits = data.authorConfig.credits;

            if(data.args[2] === "all") {
                if(authorCredits <= 0) {
                    data.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = authorCredits;
                }
            } else if(data.args[2] === "half") {
                if(authorCredits <= 1) {
                    data.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = Math.round(authorCredits / 2);
                }
            } else if(isNaN(betAmmount) || betAmmount <= 0) {
                data.reply("Invalid `betAmmount` for `roll`- (number)");
                return;
            }

            if(data.authorConfig.credits < betAmmount) {
                data.reply(`You don't have enough credits to do this-`);
                return;
            }

            if(result === betResult) {
                var multiplier = 0.55 + ((numOfOptions - 1) / 5);
                var multiplierText = (1 + multiplier).toFixed(2);
                var wonAmmount = Math.floor(betAmmount * multiplier);
                var wonAmmountText = betAmmount + wonAmmount;
                data.authorConfig.credits += wonAmmount;
                data.authorConfig.netWorth += wonAmmount;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

                //Construct message and send it
                embedRoll.description = "You won `" + wonAmmountText + "` credits-";
                embedRoll.footer = {
                    text: "Win multiplier: " + multiplierText + "x"
                }
            } else {
                data.authorConfig.credits -= betAmmount;
                data.authorConfig.credits -= betAmmount;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

                //Construct message and send it
                embedRoll.description = "You lost `" + betAmmount + "` credits-";
            }

            data.channel.send("", { embed: embedRoll }).catch(e => { console.log(e); });
        } else {
            data.channel.send("", { embed: embedRoll }).catch(e => { console.log(e); });
        }
    },
};