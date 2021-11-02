/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "mutes",
    category: "Moderation",
    description: "Displays all mutes on this server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        // TODO: support piping into file
        // TODO: add pagination
        const now = Date.now();
        const embedMutes = new command_data.global_context.modules.Discord.MessageEmbed()
            .setColor(8388736)
            .setAuthor(`❯ Mutes (${command_data.server_mutes.length})`, command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 }));

        if (command_data.server_mutes.length < 1) {
            command_data.msg.channel.send({ embeds: [embedMutes] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        let loadedMutes = 0;
        const expectedMutes = command_data.server_mutes.length < 25 ? command_data.server_mutes.length : 25;
        command_data.server_mutes.slice(command_data.server_mutes.length - 25).forEach(async (mute) => {
            const mutedUser = await command_data.global_context.bot.users.fetch(mute.user_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            if (mutedUser !== undefined) {
                const remainingText = mute.end === null ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(mute.end - now);
                embedMutes.addField(`Mute - ${mutedUser.tag}`, `Remaining: \`${remainingText}\``);
            }

            loadedMutes += 1;
            if (loadedMutes >= expectedMutes) {
                command_data.msg.channel.send({ embeds: [embedMutes] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        });
    },
} as Command;
