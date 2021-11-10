/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { convert_time } from "../scripts/utils/util_time";

export default {
    name: "mutes",
    category: "Moderation",
    description: "Displays all mutes on this server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        /*
         * TODO: support piping into file
         * TODO: add pagination
         */
        const now = Date.now();
        const url = command_data.message.guild.iconURL({ format: "png", dynamic: true, size: 1024 });

        const fields: any[] = [];
        let loadedMutes = 0;
        const expectedMutes = command_data.guild_mutes.length < 25 ? command_data.guild_mutes.length : 25;
        command_data.guild_mutes.slice(command_data.guild_mutes.length - 25).forEach(async (mute) => {
            const mutedUser = await command_data.global_context.bot.users.fetch(mute.user_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (mutedUser !== null) {
                const remainingText = mute.end === null ? "Forever" : convert_time(mute.end - now);
                fields.push({ name: `Mute - ${mutedUser.tag}`, value: `Remaining: \`${remainingText}\`` });
            }

            loadedMutes += 1;
            if (loadedMutes >= expectedMutes) {
                const embedMutes = {
                    color: 8388736,
                    author: {
                        name: `❯ Mutes (${command_data.guild_mutes.length})`,
                        icon_url: url === null ? undefined : url,
                    },
                    fields: [],
                };
                command_data.message.channel.send({ embeds: [embedMutes] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        });
    },
} as Command;
