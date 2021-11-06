/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "steal",
    category: "Profile",
    description: "Steals credits from other people.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to mention somebody.", "mention") ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        if (command_data.tagged_user.id === command_data.msg.author.id) {
            command_data.msg.reply("You can't steal from yourself silly~");
            return;
        }

        const end = new Date();
        const start = new Date(command_data.author_user_config.last_steal_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));

        if (diff < 360) {
            const end_needed = new Date(start.getTime() + 3600000 * 6);
            const time_left = (end_needed.getTime() - end.getTime()) / command_data.global_context.bot_config.speed;
            command_data.msg.reply(`You need to wait more \`${command_data.global_context.neko_modules.timeConvert.convert_time(time_left)}\` before doing this.`);
            return;
        }

        command_data.author_user_config.last_steal_time = end.getTime();

        const min_credits = 0;
        const max_credits = Math.round((command_data.tagged_user_config.credits / 100) * [ 7 ][0]);
        let credits_amount = Math.floor(Math.random() * (max_credits - min_credits + 1) + min_credits);
        credits_amount = credits_amount > [ 500 ][0] ? [ 500 ][0] : credits_amount;

        command_data.author_user_config.credits += credits_amount;
        command_data.author_user_config.net_worth += credits_amount;
        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.msg.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You stole \`${command_data.global_context.utils.format_number(credits_amount)} 💵\` from \`${command_data.tagged_user.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_user_notification(notification);
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.author_user_config);

        command_data.tagged_user_config.credits -= credits_amount;
        command_data.tagged_user_config.net_worth -= credits_amount;
        const notification_t = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.tagged_user.id,
            timestamp: Date.now(),
            description: `<time_ago> You were stolen \`${command_data.global_context.utils.format_number(credits_amount)} 💵\` by \`${command_data.msg.author.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_user_notification(notification_t);
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.tagged_user_config);

        const embedSteal = {
            color: 8388736,
            description: `You stole \`${command_data.global_context.utils.format_number(credits_amount)} 💵\` from \`${command_data.tagged_user.tag}\`! (Current Credits: \`${command_data.global_context.utils.format_number(command_data.author_user_config.credits)}$\`)`,
        };
        command_data.msg.channel.send({ embeds: [ embedSteal ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
