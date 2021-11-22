/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import { get_time_difference } from "../scripts/utils/time";
import { pick_random, format_number } from "../scripts/utils/general";

export default {
    name: "beg",
    category: "Profile",
    description: "Gets credits by begging from other people.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }

        const diff = get_time_difference(command_data.user_data.last_beg_time, 60, command_data.bot_data.speed);
        if (diff.diff < 60) {
            command_data.message.reply(`You need to wait more \`${diff.left}\` before doing this.`);
            return;
        }
        command_data.user_data.last_beg_time = Date.now();

        const min_credits = [50][0];
        const max_credits = [80][0];
        let credits_amount = Math.floor(Math.random() * (max_credits - min_credits + 1) + min_credits);

        const chance = Math.floor(Math.random() * 100) + 1;
        let answers = [];
        let answer_color = 6732650;
        if (chance <= [40][0]) {
            answers = command_data.bot_data.beg_success_answers;
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.message.author.id,
                timestamp: Date.now(),
                description: `<time_ago> You begged and got \`${format_number(credits_amount)} 💵\`.`,
            };
            command_data.global_context.neko_modules_clients.db.add_notification(notification);
        } else {
            answers = command_data.bot_data.beg_failed_answers;
            answer_color = 15483730;
            credits_amount = 0;
            const notification = {
                id: randomBytes(16).toString("hex"),
                user_ID: command_data.message.author.id,
                timestamp: Date.now(),
                description: "<time_ago> You begged, but failed.",
            };
            command_data.global_context.neko_modules_clients.db.add_notification(notification);
        }

        let answer = pick_random(answers);
        answer = answer.replace("<credits_amount>", `\`${format_number(credits_amount)}💵\``);

        const member = pick_random(Array.from((await command_data.message.guild.members.fetch()).values()));
        answer = answer.replace("<user>", `\`${member.user.tag}\``);

        command_data.user_data.credits += credits_amount;
        command_data.user_data.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const embedBeg = {
            color: answer_color,
            description: `${answer} (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.guild_data.prefix}economyguide`,
            },
        };
        command_data.message.channel.send({ embeds: [embedBeg] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
