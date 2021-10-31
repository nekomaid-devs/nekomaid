/* Types */
import { CommandData } from "../ts/types";
import { Permissions } from "discord.js";

/* Local Imports */
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "bans",
    category: "Moderation",
    description: "Displays all bans on this server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.BAN_MEMBERS), new NeededPermission("me", Permissions.FLAGS.BAN_MEMBERS)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        // TODO: support piping into file
        // TODO: add pagination
        const now = Date.now();
        const embedBans = new command_data.global_context.modules.Discord.MessageEmbed()
            .setColor(8388736)
            .setAuthor(`❯ Bans (${command_data.server_bans.length})`, command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 }));

        if (command_data.server_bans.length < 1) {
            command_data.msg.channel.send({ embeds: [embedBans] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        command_data.msg.guild.bans
            .fetch()
            .then((serverBansResult) => {
                const serverBansByID = serverBansResult.reduce((acc, curr) => {
                    acc.set(curr.user.id, curr);
                    return acc;
                }, new Map());
                command_data.server_bans.slice(-25).forEach((ban) => {
                    const bannedMember = serverBansByID.get(ban.user_ID);
                    if (bannedMember !== undefined) {
                        const remainingText = ban.end === -1 ? "Forever" : command_data.global_context.neko_modules.timeConvert.convert_time(ban.end - now);
                        embedBans.addField(`Ban - ${bannedMember.user.tag}`, `Remaining: \`${remainingText}\``);
                    }
                });

                command_data.msg.channel.send({ embeds: [embedBans] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            })
            .catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
    },
};
