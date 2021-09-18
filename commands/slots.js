const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "slots",
    category: "Profile",
    description: "Makes it possible to win credits with a slot.",
    helpUsage: "[ammount/all/half/%]`",
    exampleUsage: "100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount you're betting.", "int>0/all/half")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let credits_ammount = parseInt(command_data.args[0]);
        if(command_data.args[0] === "all") {
            if(command_data.author_config.credits <= 0) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            } else {
                credits_ammount = command_data.author_config.credits;
            }
        } else if(command_data.args[0] === "half") {
            if(command_data.author_config.credits <= 1) {
                command_data.msg.reply(`You don't have enough credits to do this.`);
                return;
            } else {
                credits_ammount = Math.round(command_data.author_config.credits / 2);
            }
        } else if(command_data.args[0].includes("%")) {
            if(credits_ammount > 0 && credits_ammount <= 100) {
                credits_ammount = Math.round(command_data.author_config.credits * (credits_ammount / 100));
                if(credits_ammount < 1 || command_data.author_config.credits <= 0) {
                    command_data.msg.reply(`You don't have enough credits to do this.`);
                    return;
                }
            } else {
                command_data.msg.reply(`Invalid percentage ammount.`);
                return;
            }
        }

        if(command_data.author_config.credits - credits_ammount < 0) {
            command_data.msg.reply(`You don't have enough credits to do this.`);
            return;
        }

        let slotsDescription = "<res_0> <res_1> <res_2>";
        let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedSlots = {
            author: { name: "Slots" },
            color: 8388736,
            description: slotsDescription.replace("<res_0>", "❓").replace("<res_1>", "❓").replace("<res_2>", "❓"),
            footer: { text: "Rolling..." }
        }

        let options = [];
        if(command_data.global_context.utils.pick_random(true, false)) {
            options.push(...["<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>", "<:n_slots_1:865743549005037578>"]);
        } else {
            options.push(...["<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>", "<:n_slots_2:865743599147548702>"]);
        }
        if(command_data.global_context.utils.pick_random(true, false)) {
            options.push(...["<:n_slots_3:865742111067602964>", "<:n_slots_3:865742111067602964>", "<:n_slots_3:865742111067602964>"]);
        } else {
            options.push(...["<:n_slots_4:865742140658548757>", "<:n_slots_4:865742140658548757>", "<:n_slots_4:865742140658548757>"]);
        }
        if(command_data.global_context.utils.pick_random(true, false)) {
            options.push(...["<:n_slots_5:865742192219783230>"]);
        } else {
            options.push(...["<:n_slots_6:865744198472171570>"]);
        }

        // 55.5% for min. 1 | 30% for min. 2 | 16% for min. 3
        // 33.3% for min. 1 | 11% for min. 2 | 3.6% for min. 3
        // 11.1% for min. 1 | 1.2% for min. 2 | 0.1% for min. 3
        //
        // If user bets 10k in 100 splits they get:
        // 16x  $ 200  = 3,2k
        // 3.6x $ 1k   = 3.6k
        // 0.1x $ 20k  = 2k

        let message = await command_data.msg.channel.send("", { embed: embedSlots }).catch(e => { command_data.global_context.logger.api_error(e); });
        setTimeout(async() => {
            let res_0 = command_data.global_context.utils.pick_random(options);
            embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", "❓").replace("<res_2>", "❓");
            message.edit("", { embed: embedSlots }).catch(e => { command_data.global_context.logger.api_error(e); });

            setTimeout(async() => {
                let res_1 = command_data.global_context.utils.pick_random(options);
                embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", res_1).replace("<res_2>", "❓");
                message.edit("", { embed: embedSlots }).catch(e => { command_data.global_context.logger.api_error(e); });

                setTimeout(async() => {
                    let res_2 = command_data.global_context.utils.pick_random(options);
                    embedSlots.description = slotsDescription.replace("<res_0>", res_0).replace("<res_1>", res_1).replace("<res_2>", res_2);

                    if(res_0 === res_1 && res_1 === res_2) {
                        let won_ammount = { 
                            "<:n_slots_1:865743549005037578>": credits_ammount * 2,
                            "<:n_slots_2:865743599147548702>": credits_ammount * 2,
                            "<:n_slots_3:865742111067602964>": credits_ammount * 10,
                            "<:n_slots_4:865742140658548757>": credits_ammount * 10,
                            "<:n_slots_5:865742192219783230>": credits_ammount * 20,
                            "<:n_slots_6:865744198472171570>": credits_ammount * 20
                        }[res_0];
                        
                        command_data.author_config.credits += won_ammount;
                        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

                        embedSlots.footer.text = `Won ${command_data.global_context.utils.format_number(won_ammount)}$!`;
                    } else {
                        command_data.author_config.credits -= credits_ammount;
                        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", user: command_data.author_config });

                        embedSlots.footer.text = `Lost ${command_data.global_context.utils.format_number(credits_ammount)}$...`;
                    }

                    message.edit("", { embed: embedSlots }).catch(e => { command_data.global_context.logger.api_error(e); });
                }, 750);
            }, 750);
        }, 750);
    },
};