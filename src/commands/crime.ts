/* Types */
import { CommandData, Command, ShrineBonus } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import { get_time_difference } from "../scripts/utils/time";
import { pick_random, format_number } from "../scripts/utils/general";

export default {
    name: "crime",
    category: "Profile",
    description: "Gets or loses credits by doing crimes.",
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
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.user_data.b_crime_den < 1) {
            command_data.message.channel.send("You need to build `Neko's Crime Den` to do crimes.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const diff = get_time_difference(command_data.user_data.last_crime_time, 60 * 3, command_data.bot_data.speed);
        if (diff.diff < 60 * 3) {
            command_data.message.reply(`You need to wait more \`${diff.left}\` before doing this.`);
            return;
        }
        command_data.user_data.last_crime_time = Date.now();

        const min_credits = [0, 250, 350, 400, 500, 550, 675, 700, 750, 950, 1100][command_data.user_data.b_crime_den];
        const max_credits = [0, 300, 375, 425, 550, 650, 700, 725, 850, 1000, 1250][command_data.user_data.b_crime_den];
        let credits_amount = Math.random() * (max_credits - min_credits + 1) + min_credits;

        const chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if (chance <= [0, 50, 55, 60, 66, 70, 70, 70, 75, 75, 80][command_data.user_data.b_crime_den]) {
            answers = command_data.bot_data.crime_success_answers;
        } else {
            answers = command_data.bot_data.crime_failed_answers;
            answer_color = 15483730;
            credits_amount = 0;
        }
        credits_amount *= command_data.bot_data.crime_multiplier;
        credits_amount *= command_data.bot_data.shrine_bonus === ShrineBonus.CRIME ? [1, 1.01, 1.01, 1.03, 1.05, 1.07, 1.1, 1.1, 1.15, 1.15, 1.15][command_data.bot_data.b_shrine] : 1;
        credits_amount = Math.round(credits_amount * [1, 1.01, 1.03, 1.05, 1.1, 1.15, 1.2, 1.22, 1.25, 1.25, 1.25][command_data.bot_data.b_crime_monopoly]);
        if (credits_amount !== 0) {
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.message.author.id,
                timestamp: Date.now(),
                description: `<time_ago> You did some crime and got \`${format_number(credits_amount)} 💵\`.`,
            };
            command_data.global_context.neko_modules_clients.db.add_notification(notification);
        } else {
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.message.author.id,
                timestamp: Date.now(),
                description: "<time_ago> You did some crime, but failed.",
            };
            command_data.global_context.neko_modules_clients.db.add_notification(notification);
        }

        let answer = pick_random(answers);
        answer = answer.replace("<credits_amount>", `\`${format_number(credits_amount)}💵\``);

        command_data.user_data.credits += credits_amount;
        command_data.user_data.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const embedCrime = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.guild_data.prefix}economyguide`,
            },
        };
        command_data.message.channel.send({ embeds: [embedCrime] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
