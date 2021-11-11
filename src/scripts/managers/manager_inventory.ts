/* Types */
import { CommandData, ItemData } from "../../ts/base";

/* Local Imports */
import { pick_random, format_number } from "../utils/util_general";

class InventoryManager {
    use_item(command_data: CommandData, item: ItemData, target_indexes: number[]) {
        switch (item.type) {
            case "box": {
                let payout_amount = 0;
                for (let i = 0; i < target_indexes.length; i++) {
                    payout_amount += pick_random(item.data.box_payouts);
                }
                command_data.user_data.credits += payout_amount;
                command_data.user_data.net_worth += payout_amount;

                const embedBox = {
                    color: 8388736,
                    description: `\`${command_data.message.author.tag}\` opened \`${target_indexes.length}x ${item.display_name}\` and got \`${format_number(payout_amount)}💵\`! (Current Credits: \`${format_number(
                        command_data.user_data.credits
                    )}$\`)`,
                };
                command_data.message.channel.send({ embeds: [embedBox] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }

            case "cash": {
                const payout_amount = item.data.cash_payout * target_indexes.length;
                command_data.user_data.credits += payout_amount;
                command_data.user_data.net_worth += payout_amount;

                const embedCash = {
                    color: 8388736,
                    description: `\`${command_data.message.author.tag}\` opened \`${target_indexes.length}x ${item.display_name}\` and got \`${format_number(payout_amount)}💵\`! (Current Credits: \`${format_number(
                        command_data.user_data.credits
                    )}$\`)`,
                };
                command_data.message.channel.send({ embeds: [embedCash] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }

            case "cash_others": {
                const taggedUser = command_data.tagged_users[0];
                if (taggedUser.id === command_data.message.author.id) {
                    command_data.message.reply("You can't give credits from this item to yourself (mention somebody else).");
                    return;
                }

                const payout_amount = item.data.cash_payout * target_indexes.length;
                command_data.tagged_user_data.credits += payout_amount;
                command_data.tagged_user_data.net_worth += payout_amount;
                command_data.global_context.neko_modules_clients.db.edit_user(command_data.tagged_user_data);

                const embedCashOthers = {
                    color: 8388736,
                    description: `\`${command_data.message.author.tag}\` gave \`${target_indexes.length}x ${item.display_name}\` to \`${command_data.tagged_user.tag}\` and they got \`${format_number(
                        payout_amount
                    )}💵\`! (Current Credits: \`${format_number(command_data.tagged_user_data.credits)}$\`)`,
                };
                command_data.message.channel.send({ embeds: [embedCashOthers] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                break;
            }

            default:
                command_data.message.reply("This item can't be used!");
                return;
        }

        target_indexes.forEach((index) => {
            const item = command_data.user_data.inventory.splice(index, 1)[0];
            command_data.global_context.neko_modules_clients.db.remove_inventory_item(item.id);
        });

        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);
    }
}

export default InventoryManager;
