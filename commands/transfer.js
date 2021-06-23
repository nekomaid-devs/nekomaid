const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'transfer',
    category: 'Profile',
    description: 'Transfers credits to another user-',
    helpUsage: "[ammount/all] [mention]`",
    exampleUsage: "100 /userTag/",
    hidden: false,
    aliases: ["pay"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1"),
        new NeededArgument(1, "You need to type in an ammount-", "none"),
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Argument & Permission check
        if(data.authorUser.id === data.taggedUser.id) {
            data.reply(`You can't tranfer credits to yourself-`);
            return;
        }

        var creditsAmmount = parseInt(data.args[0]);

        if(data.args[0] === "all") {
            if(data.authorConfig.credits <= 0) {
                data.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = data.authorConfig.credits;
            }
        } else if(data.args[0] === "half") {
            if(data.authorConfig.credits <= 1) {
                data.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = Math.round(data.authorConfig.credits / 2);
            }
        } else if(isNaN(creditsAmmount) || creditsAmmount <= 0) {
            data.channel.send(`Invalid credits ammount-`).catch(e => { console.log(e); });
            return;
        }

        //Check if author has enough credits, transfer them
        if(data.authorConfig.credits - creditsAmmount < 0) {
            data.reply(`You don't have enough credits to do this-`);
            return;
        }

        data.authorConfig.credits -= creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        data.taggedUserConfig.credits += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.taggedUser.id, user: data.taggedUserConfig });

        //Construct message and send it
        var embedTransfer = {
            color: 8388736,
            description: "Transfered `" + creditsAmmount + "💵` from `" + data.authorTag + "` to `" + data.taggedUserTag + "` (Current Credits: `" + data.authorConfig.credits + "$`)"
        }

        console.log("[transfer] Transfered " + creditsAmmount + " credits from " + data.authorTag + " to " + data.taggedUserTag + " on Server(id: " + data.guild.id + ")");
        data.channel.send("", { embed: embedTransfer }).catch(e => { console.log(e); });
    },
};