/* Types */
import { CommandData, Command, ShrineBonus } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    name: "crime",
    category: "Profile",
    description: "Gets or loses credits by doing crimes.",
    helpUsage: "`",
    exampleUsage: "",
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
        if (command_data.author_user_config.b_crime_den < 1) {
            command_data.msg.channel.send("You need to build `Neko's Crime Den` to do crimes.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const end = new Date();
        const start = new Date(command_data.author_user_config.last_crime_time);
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

        command_data.author_user_config.last_crime_time = end.getTime();

        const min_credits = [ 0, 250, 350, 400, 500, 550, 675, 700, 750, 950, 1100 ][command_data.author_user_config.b_crime_den];
        const max_credits = [ 0, 300, 375, 425, 550, 650, 700, 725, 850, 1000, 1250 ][command_data.author_user_config.b_crime_den];
        let credits_amount = Math.random() * (max_credits - min_credits + 1) + min_credits;

        const chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if (chance <= [ 0, 50, 55, 60, 66, 70, 70, 70, 75, 75, 80 ][command_data.author_user_config.b_crime_den]) {
            answers = command_data.global_context.bot_config.crime_success_answers;
        } else {
            answers = command_data.global_context.bot_config.crime_failed_answers;
            answer_color = 15483730;
            credits_amount = 0;
        }
        credits_amount *= command_data.global_context.bot_config.crime_multiplier;
        credits_amount *= command_data.global_context.bot_config.shrine_bonus === ShrineBonus.CRIME ? [ 1, 1.01, 1.01, 1.03, 1.05, 1.07, 1.1, 1.1, 1.15, 1.15, 1.15 ][command_data.global_context.bot_config.b_shrine] : 1;
        credits_amount = Math.round(credits_amount * [ 1, 1.01, 1.03, 1.05, 1.1, 1.15, 1.2, 1.22, 1.25, 1.25, 1.25 ][command_data.global_context.bot_config.b_crime_monopoly]);
        if (credits_amount !== 0) {
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.msg.author.id,
                timestamp: Date.now(),
                description: `<time_ago> You did some crime and got \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`.`
            };
            command_data.global_context.neko_modules_clients.db.add_user_notification(notification);
        } else {
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.msg.author.id,
                timestamp: Date.now(),
                description: "<time_ago> You did some crime, but failed."
            };
            command_data.global_context.neko_modules_clients.db.add_user_notification(notification);
        }

        let answer = command_data.global_context.utils.pick_random(answers);
        answer = answer.replace("<credits_amount>", `\`${command_data.global_context.utils.format_number(credits_amount)}💵\``);

        command_data.author_user_config.credits += credits_amount;
        command_data.author_user_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.author_user_config);

        const embedCrime = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_user_config.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.server_config.prefix}economyguide`
            }
        };
        command_data.msg.channel.send({ embeds: [ embedCrime ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
