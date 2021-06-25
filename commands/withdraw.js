const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "withdraw",
    category: "Profile",
    description: "Transfers credits from bank to user-",
    helpUsage: "[ammount/all]`",
    exampleUsage: "100",
    hidden: false,
    aliases: ["with"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var creditsAmmount = parseInt(command_data.args[0]);

        if(command_data.args[0] === "all") {
            if(data.authorConfig.bank <= 0) {
                command_data.msg.reply(`Your bank account doesn't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = data.authorConfig.bank;
            }
        } else if(isNaN(creditsAmmount) || creditsAmmount <= 0) {
            command_data.msg.reply(`Invalid credits ammount-`);
            return;
        }

        //Check if author's bank has enough credits, withdraw them
        if(data.authorConfig.bank - creditsAmmount < 0) {
            command_data.msg.reply(`You don't have enough credits in bank to do this-`);
            return;
        }

        data.authorConfig.bank -= creditsAmmount;
        data.authorConfig.credits += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        //Construct message and send it
        let embedWithdraw = {
            color: 8388736,
            description: "Withdrew `" + creditsAmmount + "💵` from bank to `" + command_data.msg.author.tag + "` (Current Credits: `" + data.authorConfig.credits + "$`)"
        }
        
        command_data.msg.channel.send("", { embed: embedWithdraw }).catch(e => { console.log(e); });
    },
};