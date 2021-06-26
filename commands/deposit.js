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
        let credits_ammount = parseInt(command_data.args[0]);
        if(command_data.args[0] === "all") {
            if(command_data.author_config.credits <= 0) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                credits_ammount = command_data.author_config.credits;
            }
        } else if(command_data.args[0] === "half") {
            if(command_data.author_config.credits <= 1) {
                command_data.msg.reply(`You don't have enough credits to do this-`);
                return;
            } else {
                credits_ammount = Math.round(command_data.author_config.credits / 2);
            }
        } else if(isNaN(credits_ammount) || credits_ammount <= 0) {
            command_data.msg.reply(`Invalid credits ammount-`);
            return;
        }

        if(command_data.author_config.credits - credits_ammount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this-`);
            return;
        }

        let bank_upgrade = 0;
        command_data.author_config.inventory.forEach(item => {
            command_data.global_context.bot_config.items.forEach(item_2 => {
                if(item_2.id === item && item_2.type === "bankLimit") {
                    bank_upgrade += item_2.limit;
                }
            });
        });

        if(command_data.author_config.bank + credits_ammount > command_data.global_context.bot_config.bankLimit + bank_upgrade) {
            command_data.msg.reply(`You can't transfer that much-`);
            return;
        }

        command_data.author_config.credits -= credits_ammount;
        command_data.author_config.bank += credits_ammount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

        let embedDeposit = {
            color: 8388736,
            description: `Deposited \`${creditsAmmount} 💵\` to bank of \`${command_data.msg.author.tag}\` (Current Credits: \`${command_data.author_config.credits}$\`)`
        }
        command_data.msg.channel.send("", { embed: embedDeposit }).catch(e => { console.log(e); });
    },
};