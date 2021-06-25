const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "deposit",
    category: "Profile",
    description: "Deposits credits from user to bank-",
    helpUsage: "[ammount/all]`",
    exampleUsage: "100",
    hidden: false,
    aliases: ["dep"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var creditsAmmount = parseInt(command_data.args[0]);

        if(command_data.args[0] === "all") {
            if(data.authorConfig.credits <= 0) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = data.authorConfig.credits;
            }
        } else if(command_data.args[0] === "half") {
            if(data.authorConfig.credits <= 1) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = Math.round(data.authorConfig.credits / 2);
            }
        } else if(isNaN(creditsAmmount) || creditsAmmount <= 0) {
            command_data.msg.reply(`Invalid credits ammount-`);
            return;
        }

        //Check if author has enough credits, deposit them
        if(data.authorConfig.credits - creditsAmmount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        var bankUpgrade = 0;
        data.authorConfig.inventory.forEach(item => {
            command_data.global_context.bot_config.items.forEach(item2 => {
                if(item2.id === item && item2.type === "bankLimit") {
                    bankUpgrade += item2.limit;
                }
            });
        });

        if(data.authorConfig.bank + creditsAmmount > command_data.global_context.bot_config.bankLimit + bankUpgrade) {
            command_data.msg.reply(`You can't transfer that much-`);
            return;
        }

        data.authorConfig.credits -= creditsAmmount;
        data.authorConfig.bank += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct message and send it
        let embedDeposit = {
            color: 8388736,
            description: "Deposited `" + creditsAmmount + "💵` to bank of `" + command_data.msg.author.tag + "` (Current Credits: `" + data.authorConfig.credits + "$`)"
        }

        command_data.msg.channel.send("", { embed: embedDeposit }).catch(e => { console.log(e); });
    },
};