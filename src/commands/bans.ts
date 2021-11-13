/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { ms_to_string } from "../scripts/utils/util_time";

export default {
    name: "bans",
    category: "Moderation",
    description: "Displays all bans on this server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.BAN_MEMBERS), new Permission("me", Permissions.FLAGS.BAN_MEMBERS)],
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
        let loadedBans = 0;
        const expectedBans = command_data.guild_bans.length < 25 ? command_data.guild_bans.length : 25;
        command_data.guild_bans.slice(command_data.guild_bans.length - 25).forEach((ban) => {
            const remaining_text = ban.end === null ? "Forever" : ms_to_string(ban.end - now);
            fields.push({ name: `Ban - <@${ban.user_ID}>`, value: `Remaining: \`${remaining_text}\`` });

            loadedBans += 1;
            if (loadedBans >= expectedBans) {
                const embedBans = {
                    color: 8388736,
                    author: {
                        name: `❯ Mutes (${command_data.guild_bans.length})`,
                        icon_url: url === null ? undefined : url,
                    },
                    fields: [],
                };
                command_data.message.channel.send({ embeds: [embedBans] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        });
    },
} as Command;
