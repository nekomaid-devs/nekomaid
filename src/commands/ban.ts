/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";
import { convert_string_to_ms } from "../scripts/utils/util_time";

export default {
    name: "ban",
    category: "Moderation",
    description: "Bans the tagged user.",
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/user_tag/ 1h Spamming",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true), new Argument(2, "Argument needs to be a time format.", "none", false), new Argument(3, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS), new Permission("me", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const time = command_data.args.length < 2 ? null : command_data.args[1].toLowerCase() === "forever" ? null : convert_string_to_ms(command_data.args[1]);
        const time_text = time === null ? "Forever" : time;
        let reason = "None";
        if (command_data.args.length > 2) {
            reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[2]));
        }

        if (command_data.tagged_member.bannable === false) {
            command_data.message.reply(`Couldn't ban \`${command_data.tagged_user.tag}\`. (Try moving Nekomaid's permissions above the user you want to ban)`);
            return;
        }

        const previous_ban = command_data.guild_bans.find((e) => {
            return e.user_ID === command_data.tagged_user.id;
        });
        if (previous_ban === undefined) {
            command_data.message.channel.send(`Banned \`${command_data.tagged_user.tag}\` for \`${time_text}\`.`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.message.reply(`\`${command_data.tagged_user.tag}\` is already banned.`);
            return;
        }

        command_data.global_context.data.last_moderation_actions.set(command_data.message.guild.id, {
            moderator: command_data.message.author.id,
            duration: time_text,
            start: Date.now(),
            end: time === null ? null : Date.now() + time,
            reason: reason,
        });
        command_data.tagged_member.ban({ reason: reason });
    },
} as Command;
