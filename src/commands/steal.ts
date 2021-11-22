/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_time_difference } from "../scripts/utils/time";
import { format_number } from "../scripts/utils/general";

export default {
    name: "steal",
    category: "Profile",
    description: "Steals credits from other people.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.tagged_user.id === command_data.message.author.id) {
            command_data.message.reply("You can't steal from yourself silly~");
            return;
        }

        const diff = get_time_difference(command_data.user_data.last_steal_time, 60 * 6, command_data.bot_data.speed);
        if (diff.diff < 60 * 6) {
            command_data.message.reply(`You need to wait more \`${diff.left}\` before doing this.`);
            return;
        }
        command_data.user_data.last_steal_time = Date.now();

        const min_credits = 0;
        const max_credits = Math.round((command_data.tagged_user_data.credits / 100) * [7][0]);
        let credits_amount = Math.floor(Math.random() * (max_credits - min_credits + 1) + min_credits);
        credits_amount = credits_amount > [500][0] ? [500][0] : credits_amount;

        command_data.user_data.credits += credits_amount;
        command_data.user_data.net_worth += credits_amount;
        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.message.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You stole \`${format_number(credits_amount)} 💵\` from \`${command_data.tagged_user.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification);
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        command_data.tagged_user_data.credits -= credits_amount;
        command_data.tagged_user_data.net_worth -= credits_amount;
        const notification_t = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.tagged_user.id,
            timestamp: Date.now(),
            description: `<time_ago> You were stolen \`${format_number(credits_amount)} 💵\` by \`${command_data.message.author.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification_t);
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.tagged_user_data);

        const embedSteal = {
            color: 8388736,
            description: `You stole \`${format_number(credits_amount)} 💵\` from \`${command_data.tagged_user.tag}\`! (Current Credits: \`${format_number(command_data.user_data.credits)}$\`)`,
        };
        command_data.message.channel.send({ embeds: [embedSteal] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
