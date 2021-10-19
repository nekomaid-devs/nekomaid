class InventoryManager {
    use_item(command_data, item_prefab, target_indexes) {
        switch (item_prefab.type) {
            case "box": {
                let payout_amount = 0;
                for (var i = 0; i < target_indexes.length; i += 1) {
                    payout_amount += command_data.global_context.utils.pick_random(item_prefab.box_payouts);
                }
                command_data.author_config.credits += payout_amount;
                command_data.author_config.net_worth += payout_amount;

                let embedBox = {
                    color: 8388736,
                    description: `\`${command_data.msg.author.tag}\` opened \`${target_indexes.length}x ${item_prefab.display_name}\` and got \`${command_data.global_context.utils.format_number(
                        payout_amount
                    )}💵\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`,
                };
                command_data.msg.channel.send({ embeds: [embedBox] }).catch((e) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }

            case "cash": {
                let payout_amount = item_prefab.cash_payout * target_indexes.length;
                command_data.author_config.credits += payout_amount;
                command_data.author_config.net_worth += payout_amount;

                let embedCash = {
                    color: 8388736,
                    description: `\`${command_data.msg.author.tag}\` opened \`${target_indexes.length}x ${item_prefab.display_name}\` and got \`${command_data.global_context.utils.format_number(
                        payout_amount
                    )}💵\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_config.credits)}$\`)`,
                };
                command_data.msg.channel.send({ embeds: [embedCash] }).catch((e) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }

            case "cash_others": {
                var taggedUser = command_data.tagged_users[0];
                if (taggedUser.id === command_data.msg.author.id) {
                    command_data.msg.reply("You can't give credits from this item to yourself (mention somebody else).");
                    return;
                }

                let payout_amount = item_prefab.cash_payout * target_indexes.length;
                command_data.tagged_user_config.credits += payout_amount;
                command_data.tagged_user_config.net_worth += payout_amount;

                let embedCashOthers = {
                    color: 8388736,
                    description: `\`${command_data.msg.author.tag}\` gave \`${target_indexes.length}x ${item_prefab.display_name}\` to \`${command_data.tagged_user.tag}\` and they got \`${command_data.global_context.utils.format_number(
                        payout_amount
                    )}💵\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.tagged_user_config.credits)}$\`)`,
                };
                command_data.msg.channel.send({ embeds: [embedCashOthers] }).catch((e) => {
                    command_data.global_context.logger.api_error(e);
                });

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.tagged_user_config });
                break;
            }

            default:
                command_data.msg.reply("This item can't be used!");
                return;
        }

        target_indexes.forEach((index) => {
            command_data.author_config.inventory.splice(index, 1);
        });

        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });
    }
}

module.exports = InventoryManager;
