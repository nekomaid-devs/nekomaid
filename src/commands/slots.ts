/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { pick_random, format_number } from "../scripts/utils/general";

export default {
    name: "slots",
    category: "Profile",
    description: "Makes it possible to win credits with a slot.",
    helpUsage: "[amount/all/half/%]`",
    exampleUsage: "100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an amount you're betting.", "int>0/all/half", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let credits_amount = parseInt(command_data.args[0]);
        if (command_data.args[0] === "all") {
            if (command_data.user_data.credits <= 0) {
                command_data.message.reply("You don't have enough credits to do this.");
                return;
            }
            credits_amount = command_data.user_data.credits;
        } else if (command_data.args[0] === "half") {
            if (command_data.user_data.credits <= 1) {
                command_data.message.reply("You don't have enough credits to do this.");
                return;
            }
            credits_amount = Math.round(command_data.user_data.credits / 2);
        } else if (command_data.args[0].includes("%")) {
            if (credits_amount > 0 && credits_amount <= 100) {
                credits_amount = Math.round(command_data.user_data.credits * (credits_amount / 100));
                if (credits_amount < 1 || command_data.user_data.credits <= 0) {
                    command_data.message.reply("You don't have enough credits to do this.");
                    return;
                }
            } else {
                command_data.message.reply("Invalid percentage amount.");
                return;
            }
        }

        if (command_data.user_data.credits - credits_amount < 0) {
            command_data.message.reply("You don't have enough credits to do this.");
            return;
        }

        const slotsDescription = "<res_0> <res_1> <res_2>";
        const embedSlots = {
            author: { name: "Slots" },
            color: 8388736,
            description: slotsDescription.replace("<res_0>", "❓").replace("<res_1>", "❓").replace("<res_2>", "❓"),
            footer: { text: "Rolling..." },
        };

        const options: string[] = [];
        if (pick_random([true, false])) {
            options.push(...["<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>"]);
        } else {
            options.push(...["<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>"]);
        }
        if (pick_random([true, false])) {
            options.push(...["<:n_slots_3:865742111067602964>", "<:n_slots_3:865742111067602964>", "<:n_slots_3:865742111067602964>"]);
        } else {
            options.push(...["<:n_slots_4:865742140658548757>", "<:n_slots_4:865742140658548757>", "<:n_slots_4:865742140658548757>"]);
        }
        if (pick_random([true, false])) {
            options.push(...["<:n_slots_5:865742192219783230>"]);
        } else {
            options.push(...["<:n_slots_6:865744198472171570>"]);
        }

        /*
         * 55.5% for min. 1 | 30% for min. 2 | 16% for min. 3
         * 33.3% for min. 1 | 11% for min. 2 | 3.6% for min. 3
         * 11.1% for min. 1 | 1.2% for min. 2 | 0.1% for min. 3
         *
         * If user bets 10k in 100 splits they get:
         * 16x  $ 200  = 3,2k
         * 3.6x $ 1k   = 3.6k
         * 0.1x $ 20k  = 2k
         */

        const message = await command_data.message.channel.send({ embeds: [embedSlots] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }
        setTimeout(() => {
            const res_0 = pick_random(options);
            embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", "❓").replace("<res_2>", "❓");
            message.edit({ embeds: [embedSlots] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });

            setTimeout(() => {
                const res_1 = pick_random(options);
                embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", res_1).replace("<res_2>", "❓");
                message.edit({ embeds: [embedSlots] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });

                setTimeout(() => {
                    const res_2 = pick_random(options);
                    embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", res_1).replace("<res_2>", res_2);

                    if (res_0 === res_1 && res_1 === res_2) {
                        const won_ammount: Record<string, number> = {
                            "<:n_slots_1:865743549005037578>": credits_amount * 2,
                            "<:n_slots_2:865743599147548702>": credits_amount * 2,
                            "<:n_slots_3:865742111067602964>": credits_amount * 10,
                            "<:n_slots_4:865742140658548757>": credits_amount * 10,
                            "<:n_slots_5:865742192219783230>": credits_amount * 20,
                            "<:n_slots_6:865744198472171570>": credits_amount * 20,
                        };
                        const won_amount: number = won_ammount[res_0];

                        command_data.user_data.credits += won_amount;
                        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

                        embedSlots.footer.text = `Won ${format_number(won_amount)}$!`;
                    } else {
                        command_data.user_data.credits -= credits_amount;
                        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

                        embedSlots.footer.text = `Lost ${format_number(credits_amount)}$...`;
                    }

                    message.edit({ embeds: [embedSlots] }).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                }, 750);
            }, 750);
        }, 750);
    },
} as Command;
