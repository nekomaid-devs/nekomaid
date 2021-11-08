/* Types */
import { CommandData, Command, ShrineBonus } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import { convert_time } from "../scripts/utils/util_time";
import { pick_random, format_number } from "../scripts/utils/util_general";

export default {
    name: "work",
    category: "Profile",
    description: "Gets credits earned by working.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.bot_data === null) {
            return;
        }
        if (command_data.user_data.b_pancakes < 1) {
            command_data.message.channel.send("You need to build `Neko's Pancakes` to work.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const end = new Date();
        const start = new Date(command_data.user_data.last_work_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.bot_data.speed));

        if (diff < 180) {
            const end_needed = new Date(start.getTime() + 3600000 * 3);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.bot_data.speed;
            command_data.message.channel.send(`You need to wait more \`${convert_time(time_left)}\` before doing this.`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        command_data.user_data.last_work_time = end.getTime();

        const min_credits = [0, 150, 175, 250, 300, 350, 500, 575, 700, 750, 800][command_data.user_data.b_pancakes];
        const max_credits = [0, 200, 225, 300, 325, 400, 525, 600, 725, 800, 1000][command_data.user_data.b_pancakes];
        let credits_amount = Math.random() * (max_credits - min_credits + 1) + min_credits;

        const chance = Math.floor(Math.random() * 100) + 1;
        const answers = command_data.bot_data.work_answers;
        if (chance <= [-1, -1, -1, -1, 5, 7.5, 10, 3, 5, 7.5][command_data.user_data.b_pancakes]) {
            if (command_data.user_data.b_pancakes >= 8) {
                credits_amount *= 3;
            } else {
                credits_amount *= 2;
            }
        }
        credits_amount *= command_data.bot_data.work_multiplier;
        credits_amount *= command_data.bot_data.shrine_bonus === ShrineBonus.WORK ? [1, 1.01, 1.01, 1.03, 1.05, 1.07, 1.1, 1.1, 1.15, 1.15, 1.15][command_data.bot_data.b_shrine] : 1;
        credits_amount = Math.round(credits_amount * [1, 1.01, 1.03, 1.05, 1.1, 1.15, 1.2, 1.22, 1.25, 1.25, 1.25][command_data.bot_data.b_quantum_pancakes]);
        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.message.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You cooked some pancakes and got \`${format_number(credits_amount)} 💵\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification);

        let answer = pick_random(answers);
        answer = answer.replace("<credits_amount>", `\`${credits_amount}💵\``);

        command_data.user_data.credits += credits_amount;
        command_data.user_data.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const embedWork = {
            color: 6732650,
            description: `${answer} (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
            footer: {
                text: `Make sure to vote with ${command_data.guild_data.prefix}vote for free credits`,
            },
        };
        command_data.message.channel.send({ embeds: [embedWork] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
