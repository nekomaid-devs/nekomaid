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
        if(command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply(`You can't tranfer credits to yourself-`);
            return;
        }

        var creditsAmmount = parseInt(command_data.args[0]);

        if(command_data.args[0] === "all") {
            if(command_data.author_config.credits <= 0) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = command_data.author_config.credits;
            }
        } else if(command_data.args[0] === "half") {
            if(command_data.author_config.credits <= 1) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                creditsAmmount = Math.round(command_data.author_config.credits / 2);
            }
        } else if(isNaN(creditsAmmount) || creditsAmmount <= 0) {
            command_data.msg.channel.send(`Invalid credits ammount-`).catch(e => { console.log(e); });
            return;
        }

        //Check if author has enough credits, transfer them
        if(command_data.author_config.credits - creditsAmmount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        command_data.author_config.credits -= creditsAmmount;

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.tagged_user_config.credits += creditsAmmount;

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        //Construct message and send it
        let embedTransfer = {
            color: 8388736,
            description: "Transfered `" + creditsAmmount + "💵` from `" + command_data.msg.author.tag + "` to `" + command_data.tagged_user.tag + "` (Current Credits: `" + command_data.author_config.credits + "$`)"
        }

        console.log("[transfer] Transfered " + creditsAmmount + " credits from " + command_data.msg.author.tag + " to " + command_data.tagged_user.tag + " on Server(id: " + command_data.msg.guild.id + ")");
        command_data.msg.channel.send("", { embed: embedTransfer }).catch(e => { console.log(e); });
    },
};