/* Types */
import { CommandData } from "../ts/types";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    name: "beg",
    category: "Profile",
    description: "Gets credits by begging from other people.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        const end = new Date();
        const start = new Date(command_data.author_user_config.last_beg_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 60) {
            const end_needed = new Date(start.getTime() + 3600000 * 1);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules.timeConvert.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_user_config.last_beg_time = end.getTime();

        const min_credits = [50][0];
        const max_credits = [80][0];
        let credits_amount = Math.floor(Math.random() * (max_credits - min_credits + 1) + min_credits);

        const chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if (chance <= [40][0]) {
            answers = command_data.global_context.bot_config.beg_success_answers;
            command_data.author_user_config.notifications.push({
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.msg.author.id,
                timestamp: Date.now(),
                description: `<time_ago> You begged and got \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`.`,
            });
        } else {
            answers = command_data.global_context.bot_config.beg_failed_answers;
            answer_color = 15483730;
            credits_amount = 0;
            command_data.author_user_config.notifications.push({
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.msg.author.id,
                timestamp: Date.now(),
                description: `<time_ago> You begged, but failed.`,
            });
        }

        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<credits_amount>", "`" + command_data.global_context.utils.format_number(credits_amount) + "💵`");

        const member = command_data.global_context.utils.pick_random(Array.from(command_data.msg.guild.members.cache.values()));
        answer = answer.replace("<user>", "`" + member.user.tag + "`");

        command_data.author_user_config.credits += credits_amount;
        command_data.author_user_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

        const embedBeg = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_user_config.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.server_config.prefix}economyguide`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedBeg] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
