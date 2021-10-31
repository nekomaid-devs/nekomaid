/* Types */
import { CommandData } from "../ts/types";
import { Permissions } from "discord.js";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "unban",
    category: "Moderation",
    description: "Unbans the tagged user.",
    helpUsage: "[username] [?reason]` *(optional argument)*",
    exampleUsage: "/username/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in an username (ex. `LamkasDev` or `LamkasDev#4235`).", "text")],
    argumentsRecommended: [new RecommendedArgument(2, "Argument needs to be a reason.", "none")],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS), new NeededPermission("me", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        // TODO: this needs a refactor
        let unban_reason = "None";
        if (command_data.args.length > 1) {
            unban_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        let ban_info: any;
        const usernames: any[] = [];
        const tagged_user_display_name = command_data.args[0];
        command_data.msg.guild.bans
            .fetch()
            .then((server_bans_result) => {
                if (command_data.msg.guild === null) {
                    return;
                }
                server_bans_result.forEach((ban) => {
                    const tagged_user_display_name_modded = tagged_user_display_name.endsWith("#" + ban.user.discriminator) ? tagged_user_display_name : tagged_user_display_name + "#" + ban.user.discriminator;
                    if (ban.user.username + "#" + ban.user.discriminator === tagged_user_display_name_modded) {
                        usernames.push(ban.user.username + "#" + ban.user.discriminator);
                        ban_info = ban;
                    }
                });

                if (usernames.length > 1) {
                    command_data.msg.reply(`There are more than 1 user with this discriminator, so you need to specify which one (${usernames}).`);
                } else if (usernames.length < 1) {
                    command_data.msg.reply(`\`${tagged_user_display_name}\` isn't banned-`);
                } else {
                    command_data.global_context.data.last_moderation_actions.set(command_data.msg.guild.id, { moderator: command_data.msg.author.id });
                    command_data.msg.guild.members.unban(ban_info.user, unban_reason).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                        command_data.msg.reply(`Couldn't unban \`${ban_info.user.tag}\`! (Try moving Nekomaid's permissions above the user you want to unban)`);
                    });

                    command_data.msg.channel.send(`Unbanned \`${ban_info.user.tag}\`.`).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                }
            })
            .catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
    },
};
