/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "warn",
    category: "Moderation",
    description: "Warns the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Said a bad word",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true), new Argument(2, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let warn_reason = "None";
        if (command_data.args.length > 1) {
            warn_reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        const num_of_warnings = command_data.guild_warns.filter((warn) => {
            return warn.user_ID === command_data.tagged_user.id;
        }).length;
        command_data.message.channel.send(`Warned \`${command_data.tagged_user.tag}\`. (Reason: \`${warn_reason}\`, Strikes: \`${num_of_warnings}\` => \`${num_of_warnings + 1}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        command_data.global_context.bot.emit("guildMemberWarn", { member: command_data.tagged_member, moderator: command_data.message.author, reason: warn_reason, num_of_warnings: num_of_warnings });
    },
} as Command;
