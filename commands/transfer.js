const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "transfer",
    category: "Profile",
    description: "Transfers credits to another user-",
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
    execute(command_data) {
        // TODO: re-factor command
        //Argument & Permission check
        if(data.authorUser.id === command_data.tagged_user.id) {
            command_data.msg.reply(`You can't tranfer credits to yourself-`);
            return;
        }

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
            command_data.msg.channel.send(`Invalid credits ammount-`).catch(e => { console.log(e); });
            return;
        }

        //Check if author has enough credits, transfer them
        if(data.authorConfig.credits - creditsAmmount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        data.authorConfig.credits -= creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        command_data.tagged_user_config.credits += creditsAmmount;

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct message and send it
        let embedTransfer = {
            color: 8388736,
            description: "Transfered `" + creditsAmmount + "💵` from `" + command_data.msg.author.tag + "` to `" + command_data.tagged_user.tag + "` (Current Credits: `" + data.authorConfig.credits + "$`)"
        }

        console.log("[transfer] Transfered " + creditsAmmount + " credits from " + command_data.msg.author.tag + " to " + command_data.tagged_user.tag + " on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedTransfer }).catch(e => { console.log(e); });
    },
};