/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { ms_to_string } from "../scripts/utils/time";

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
        command_data.guild_mutes.slice(command_data.guild_mutes.length - 25).forEach((mute) => {
            const remaining_text = mute.end === null ? "Forever" : ms_to_string(mute.end - now);
            fields.push({ name: `Mute - <@${mute.user_ID}>`, value: `Remaining: \`${remaining_text}\`` });

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
