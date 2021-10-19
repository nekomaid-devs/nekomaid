const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "transfer",
    category: "Profile",
    description: "Transfers credits to another user.",
    helpUsage: "[mention] [amount/all/half/%]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: ["pay"],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention"), new NeededArgument(2, "You need to type in an amount.", "int>0/all/half")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        if (command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply("You can't transfer credits to yourself.");
            return;
        }

        let credits_amount = parseInt(command_data.args[1]);
        if (command_data.args[1] === "all") {
            if (command_data.author_config.credits <= 0) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            } else {
                credits_amount = command_data.author_config.credits;
            }
        } else if (command_data.args[1] === "half") {
            if (command_data.author_config.credits <= 1) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            } else {
                credits_amount = Math.round(command_data.author_config.credits / 2);
            }
        } else if (command_data.args[1].includes("%")) {
            if (credits_amount > 0 && credits_amount <= 100) {
                credits_amount = Math.round(command_data.author_config.credits * (credits_amount / 100));
                if (credits_amount < 1 || command_data.author_config.credits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }
            } else {
                command_data.msg.reply(`Invalid percentage amount.`);
                return;
            }
        }

        if (command_data.author_config.credits - credits_amount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this.`);
            return;
        }

        command_data.author_config.credits -= credits_amount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

        command_data.tagged_user_config.credits += credits_amount;
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.tagged_user_config });

        let embedTransfer = {
            color: 8388736,
            description: `Transfered \`${command_data.global_context.utils.format_number(credits_amount)} 💵\` from \`${command_data.msg.author.tag}\` to \`${
                command_data.tagged_user.tag
            }\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`,
        };
        command_data.msg.channel.send({ embeds: [embedTransfer] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
