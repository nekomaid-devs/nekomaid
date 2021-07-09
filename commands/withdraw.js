const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "withdraw",
    category: "Profile",
    description: "Transfers credits from bank to user.",
    helpUsage: "[ammount/all/half/%]`",
    exampleUsage: "100",
    hidden: false,
    aliases: ["with"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount", "int>0/all/half")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let credits_ammount = parseInt(command_data.args[0]);
        if(command_data.args[0] === "all") {
            if(command_data.author_config.bank <= 0) {
                command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                return;
            } else {
                credits_ammount = command_data.author_config.bank;
            }
        } else if(command_data.args[0] === "half") {
            if(command_data.author_config.bank <= 1) {
                command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                return;
            } else {
                credits_ammount = Math.round(command_data.author_config.bank / 2);
            }
        } else if(command_data.args[0].includes("%")) {
            if(credits_ammount > 0 && credits_ammount <= 100) {
                credits_ammount = Math.round(command_data.author_config.bank * (credits_ammount / 100));
                if(credits_ammount < 1 || command_data.author_config.bank <= 0) {
                    command_data.msg.reply(`Your bank account doesn't have enough credits to do this.`);
                    return;
                }
            } else {
                command_data.msg.reply(`Invalid percentage ammount.`);
                return;
            }
        }

        if(command_data.author_config.bank - credits_ammount < 0) {
            command_data.msg.reply(`You don't have enough credits in bank to do this.`);
            return;
        }

        command_data.author_config.bank -= credits_ammount;
        command_data.author_config.credits += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        let embedWithdraw = {
            color: 8388736,
            description: `Withdrew \`${command_data.global_context.utils.format_number(credits_ammount)} 💵\` from bank to \`${command_data.msg.author.tag}\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`
        }
        command_data.msg.channel.send("", { embed: embedWithdraw }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};