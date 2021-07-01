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
        if(command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply("You can't tranfer credits to yourself-");
            return;
        }

        // TODO: add support for %
        // TODO: update helpUsage
        let credits_ammount = parseInt(command_data.args[0]);
        if(command_data.args[0] === "all") {
            if(command_data.author_config.credits <= 0) {
                command_data.msg.reply("You don't have enough credits to do this-");
                return;
            } else {
                credits_ammount = command_data.author_config.credits;
            }
        } else if(command_data.args[0] === "half") {
            if(command_data.author_config.credits <= 1) {
                command_data.msg.reply("You don't have enough credits to do this-");
                return;
            } else {
                credits_ammount = Math.round(command_data.author_config.credits / 2);
            }
        } else if(isNaN(credits_ammount) || credits_ammount <= 0) {
            command_data.msg.channel.send("Invalid credits ammount-").catch(e => { console.log(e); });
            return;
        }

        if(command_data.author_config.credits - credits_ammount < 0) {
            command_data.msg.reply("You don't have enough credits to do this-");
            return;
        }

        command_data.author_config.credits -= credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        command_data.tagged_user_config.credits += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        let embedTransfer = {
            color: 8388736,
            description: `Transfered \`${credits_ammount} 💵\` from \`${command_data.msg.author.tag}\` to \`${command_data.tagged_user.tag}\` (Current Credits: \`${command_data.author_config.credits}$\`)`
        }
        command_data.msg.channel.send("", { embed: embedTransfer }).catch(e => { console.log(e); });
    },
};