/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "unban",
    category: "Moderation",
    description: "Unbans the tagged user.",
    helpUsage: "[username] [?reason]` *(optional argument)*",
    exampleUsage: "/username/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an username (ex. `LamkasDev` or `LamkasDev#4235`).", "text", true), new Argument(2, "Argument needs to be a reason.", "none", false)],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS), new Permission("me", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        // TODO: this needs a refactor
        let unban_reason = "None";
        if (command_data.args.length > 1) {
            unban_reason = command_data.message.content.substring(command_data.message.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        let ban_info: any;
        const usernames: any[] = [];
        const tagged_user_display_name = command_data.args[0];
        command_data.message.guild.bans
            .fetch()
            .then((guild_bans_result) => {
                if (command_data.message.guild === null) {
                    return;
                }
                guild_bans_result.forEach((ban) => {
                    const tagged_user_display_name_modded = tagged_user_display_name.endsWith(`#${ban.user.discriminator}`) ? tagged_user_display_name : `${tagged_user_display_name}#${ban.user.discriminator}`;
                    if (`${ban.user.username}#${ban.user.discriminator}` === tagged_user_display_name_modded) {
                        usernames.push(`${ban.user.username}#${ban.user.discriminator}`);
                        ban_info = ban;
                    }
                });

                if (usernames.length > 1) {
                    command_data.message.reply(`There are more than 1 user with this discriminator, so you need to specify which one (${usernames}).`);
                } else if (usernames.length < 1) {
                    command_data.message.reply(`\`${tagged_user_display_name}\` isn't banned-`);
                } else {
                    command_data.global_context.data.last_moderation_actions.set(command_data.message.guild.id, command_data.message.author.id);
                    command_data.message.guild.members.unban(ban_info.user, unban_reason).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                        command_data.message.reply(`Couldn't unban \`${ban_info.user.tag}\`! (Try moving Nekomaid's permissions above the user you want to unban)`);
                    });

                    command_data.message.channel.send(`Unbanned \`${ban_info.user.tag}\`.`).catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                }
            })
            .catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
    },
} as Command;
