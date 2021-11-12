/* Types */
import { CommandData, Command, ShrineBonus } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import { convert_time } from "../scripts/utils/util_time";
import { format_number } from "../scripts/utils/util_general";

export default {
    name: "daily",
    category: "Profile",
    description: "Gets a daily reward to user.",
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
        const end = new Date();
        const start = new Date(command_data.user_data.last_daily_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60 * 60;
        diff = Math.abs(Math.round(diff * command_data.bot_data.speed));

        if (diff < 24) {
            const end_needed = new Date(start.getTime() + 3600000 * 24);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.bot_data.speed;
            command_data.message.reply(`You need to wait more \`${convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.user_data.last_daily_time = end.getTime();

        let credits_amount = [1000][0];
        credits_amount *= command_data.bot_data.daily_multiplier;
        credits_amount *= command_data.bot_data.shrine_bonus === ShrineBonus.DAILY ? [1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.25, 1.3, 1.5, 1.5, 1.5][command_data.bot_data.b_shrine] : 1;
        credits_amount = Math.round(credits_amount);
        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.message.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You picked up a daily reward of \`${format_number(credits_amount)} 💵\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification);

        command_data.user_data.credits += credits_amount;
        command_data.user_data.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        const embedDaily = {
            color: 6732650,
            description: `Picked up daily reward of \`${format_number(credits_amount)} 💵\`! (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
            footer: {
                text: `Check out new ${command_data.guild_data.prefix}economyguide`,
            },
        };
        command_data.message.channel.send({ embeds: [embedDaily] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
