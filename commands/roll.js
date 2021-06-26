module.exports = {
    name: "roll",
    category: "Fun",
    description: "Rolls a dice- Also makes it possible to win credits by betting-",
    helpUsage: "[numberOfSides?] [result?] [bet?]` *(all arguments optional)*",
    exampleUsage: "6 2 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Get roll type
        var rollType = 6;
        if(command_data.args.length > 0) {
            rollType = parseInt(command_data.args[0]);
        }

        //Get options set
        var options = [];
        switch(rollType) {
            default:
                if(isNaN(rollType) || rollType <= 1) {
                    command_data.msg.reply("Invalid `numberOfSides` for `roll`- (number more than 1)");
                    return;
                } else {
                    for(var i = 1; i <= rollType; i += 1) {
                        options.push(i);
                    }
                }
        }

        //Get random result and image if exists
        var result = command_data.global_context.utils.pick_random(options);

        //Construct embed
        let embedRoll = {
            title: `${command_data.msg.author.tag} rolled ${result}!`,
            color: 8388736
        }

        if(command_data.args.length > 2) {
            var betResult = parseInt(command_data.args[1]);
            var betAmmount = parseInt(command_data.args[2]);

            if(isNaN(betResult) || options.includes(betResult) === false) {
                command_data.msg.reply("Invalid `betResult` for `roll`- (" + options[0] + "-" + options[options.length - 1] + ")");
                return;
            }

            //Check author's config
            var authorCredits = command_data.author_config.credits;

            if(command_data.args[2] === "all") {
                if(authorCredits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = authorCredits;
                }
            } else if(command_data.args[2] === "half") {
                if(authorCredits <= 1) {
                    command_data.msg.reply(`You don't have enough credits to do this-`);
                    return;
                } else {
                    betAmmount = Math.round(authorCredits / 2);
                }
            } else if(isNaN(betAmmount) || betAmmount <= 0) {
                command_data.msg.reply("Invalid `betAmmount` for `roll`- (number)");
                return;
            }

            if(command_data.author_config.credits < betAmmount) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            }

            if(result === betResult) {
                var multiplier = 0.55 + ((numOfOptions - 1) / 5);
                var multiplierText = (1 + multiplier).toFixed(2);
                var wonAmmount = Math.floor(betAmmount * multiplier);
                var wonAmmountText = betAmmount + wonAmmount;
                command_data.author_config.credits += wonAmmount;
                command_data.author_config.netWorth += wonAmmount;

                //Edits and broadcasts the change
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

                //Construct message and send it
                embedRoll.description = "You won `" + wonAmmountText + "` credits-";
                embedRoll.footer = {
                    text: "Win multiplier: " + multiplierText + "x"
                }
            } else {
                command_data.author_config.credits -= betAmmount;
                command_data.author_config.credits -= betAmmount;

                //Edits and broadcasts the change
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

                //Construct message and send it
                embedRoll.description = "You lost `" + betAmmount + "` credits-";
            }

            command_data.msg.channel.send("", { embed: embedRoll }).catch(e => { console.log(e); });
        } else {
            command_data.msg.channel.send("", { embed: embedRoll }).catch(e => { console.log(e); });
        }
    },
};