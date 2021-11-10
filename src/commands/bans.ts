/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { convert_time } from "../scripts/utils/util_time";

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

        command_data.message.guild.bans
            .fetch()
            .then((guildBansResult) => {
                const guildBansByID = guildBansResult.reduce((acc, curr) => {
                    acc.set(curr.user.id, curr);
                    return acc;
                }, new Map());
                command_data.guild_bans.slice(-25).forEach((ban) => {
                    const bannedMember = guildBansByID.get(ban.user_ID);
                    if (bannedMember !== undefined) {
                        const remainingText = ban.end === null ? "Forever" : convert_time(ban.end - now);
                        fields.push({ name: `Ban - ${bannedMember.user.tag}`, value: `Remaining: \`${remainingText}\`` });
                    }
                });

                const embedBans = {
                    color: 8388736,
                    author: {
                        name: `❯ Bans (${command_data.guild_bans.length})`,
                        icon_url: url === null ? undefined : url,
                    },
                    fields: [],
                };
                command_data.message.channel.send({ embeds: [embedBans] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            })
            .catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
    },
} as Command;
