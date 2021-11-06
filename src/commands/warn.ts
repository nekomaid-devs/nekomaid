/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "warn",
    category: "Moderation",
    description: "Warns the tagged user.",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/user_tag/ Said a bad word",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [ new NeededArgument(1, "You need to mention somebody.", "mention") ],
    argumentsRecommended: [ new RecommendedArgument(2, "Argument needs to be a reason.", "none") ],
    permissionsNeeded: [ new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS) ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let warn_reason = "None";
        if (command_data.args.length > 1) {
            warn_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        const num_of_warnings = command_data.server_warns.filter((warn) => {
            return warn.user_ID === command_data.tagged_user.id;
        }).length;
        command_data.msg.channel.send(`Warned \`${command_data.tagged_user.tag}\`. (Reason: \`${warn_reason}\`, Strikes: \`${num_of_warnings}\` => \`${num_of_warnings + 1}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        command_data.global_context.bot.emit("guildMemberWarn", { member: command_data.tagged_member, moderator: command_data.msg.author, reason: warn_reason, num_of_warnings: num_of_warnings });
    }
} as Command;
