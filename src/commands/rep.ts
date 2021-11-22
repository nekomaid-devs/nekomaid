/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { randomBytes } from "crypto";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_time_difference } from "../scripts/utils/time";

export default {
    name: "rep",
    category: "Profile",
    description: "Adds a reputation point to the tagged user.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention an user.", "mention", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.tagged_user.id === command_data.message.author.id) {
            command_data.message.reply("You can't give reputation to yourself!");
            return;
        }

        const diff = get_time_difference(command_data.user_data.last_rep_time, 60 * 3, command_data.bot_data.speed);
        if (diff.diff < 60 * 3) {
            command_data.message.reply(`You need to wait more \`${diff.left}\` before doing this.`);
            return;
        }
        command_data.user_data.last_rep_time = Date.now();

        const notification = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.message.author.id,
            timestamp: Date.now(),
            description: `<time_ago> You gave reputation to \`${command_data.tagged_user.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification);
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        command_data.tagged_user_data.rep += 1;
        const notification_t = {
            id: randomBytes(16).toString("hex"),
            user_ID: command_data.tagged_user.id,
            timestamp: Date.now(),
            description: `<time_ago> You were given reputation by \`${command_data.message.author.tag}\`.`,
        };
        command_data.global_context.neko_modules_clients.db.add_notification(notification_t);
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.tagged_user_data);

        command_data.message.channel.send(`Added \`1\` reputation to \`${command_data.tagged_user.tag}\`! (Current reputation: \`${command_data.tagged_user_data.rep}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
