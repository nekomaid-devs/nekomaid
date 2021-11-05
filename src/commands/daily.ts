/* Types */
import { CommandData, Command, ShrineBonus } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

export default {
    name: "daily",
    category: "Profile",
    description: "Gets a daily reward to user.",
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
        const end = new Date();
        const start = new Date(command_data.author_user_config.last_daily_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60 * 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 24) {
            const end_needed = new Date(start.getTime() + 3600000 * 24);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules.timeConvert.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_user_config.last_daily_time = end.getTime();

        let credits_amount = [1000][0];
        credits_amount = credits_amount * command_data.global_context.bot_config.daily_multiplier;
        credits_amount = credits_amount * (command_data.global_context.bot_config.shrine_bonus === ShrineBonus.DAILY ? [1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.25, 1.3, 1.5, 1.5, 1.5][command_data.global_context.bot_config.b_shrine] : 1);
        credits_amount = Math.round(credits_amount);
        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.msg.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You picked up a daily reward of \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_user_notification(notification);

        command_data.author_user_config.credits += credits_amount;
        command_data.author_user_config.net_worth += credits_amount;
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.author_user_config);

        const embedDaily = {
            color: 6732650,
            description: `Picked up daily reward of \`${command_data.global_context.utils.format_number(credits_amount)} 💵\`! (Current Credits: \`${command_data.global_context.utils.format_number(
                command_data.author_user_config.credits
            )}$\`)`,
            footer: {
                text: `Check out new ${command_data.server_config.prefix}economyguide`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedDaily] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
