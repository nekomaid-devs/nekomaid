/* Types */
import { CommandData, ShrineBonusType } from "../ts/types";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    name: "work",
    category: "Profile",
    description: "Gets credits earned by working.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        if (command_data.author_user_config.b_pancakes < 1) {
            command_data.msg.channel.send("You need to build `Neko's Pancakes` to work.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const end = new Date();
        const start = new Date(command_data.author_user_config.last_work_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 180) {
            const end_needed = new Date(start.getTime() + 3600000 * 3);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.global_context.bot_config.speed;
            command_data.msg.channel.send(`You need to wait more \`${command_data.global_context.neko_modules.timeConvert.convert_time(time_left)}\` before doing this.`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        command_data.author_user_config.last_work_time = end.getTime();

        const min_credits = [0, 150, 175, 250, 300, 350, 500, 575, 700, 750, 800][command_data.author_user_config.b_pancakes];
        const max_credits = [0, 200, 225, 300, 325, 400, 525, 600, 725, 800, 1000][command_data.author_user_config.b_pancakes];
        let credits_amount = Math.random() * (max_credits - min_credits + 1) + min_credits;

        const chance = Math.floor(Math.random() * 100) + 1;
        const answers = command_data.global_context.bot_config.work_answers;
        if (chance <= [-1, -1, -1, -1, 5, 7.5, 10, 3, 5, 7.5][command_data.author_user_config.b_pancakes]) {
            if (command_data.author_user_config.b_pancakes >= 8) {
                credits_amount *= 3;
            } else {
                credits_amount *= 2;
            }
        }
        credits_amount = credits_amount * command_data.global_context.bot_config.work_multiplier;
        credits_amount = credits_amount * (command_data.global_context.bot_config.shrine_bonus === ShrineBonusType.WORK ? [1, 1.01, 1.01, 1.03, 1.05, 1.07, 1.1, 1.1, 1.15, 1.15, 1.15][command_data.global_context.bot_config.b_shrine] : 1);
        credits_amount = Math.round(credits_amount * [1, 1.01, 1.03, 1.05, 1.1, 1.15, 1.2, 1.22, 1.25, 1.25, 1.25][command_data.global_context.bot_config.b_quantum_pancakes]);
        command_data.author_user_config.notifications.push({
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.msg.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You cooked some pancakes and got \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`.`,
        });

        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<credits_amount>", "`" + credits_amount + "💵`");

        command_data.author_user_config.credits += credits_amount;
        command_data.author_user_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

        const embedWork = {
            color: 6732650,
            description: `${answer} (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_user_config.credits)}$\`)`,
            footer: {
                text: `Make sure to vote with ${command_data.server_config.prefix}vote for free credits`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedWork] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
