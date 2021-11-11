/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "osu",
    category: "Utility",
    description: "Shows osu! stats.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.global_context.modules_clients.osu === null) {
            command_data.message.channel.send("The osu! module is disabled for this bot.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }
        if (command_data.tagged_user_data.osu_username === null) {
            command_data.message.channel.send(`You haven't set an osu! profile yet! (You can set one with \`${command_data.guild_data.prefix}osuset <username>\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.tagged_user_data.osu_username }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (user === null) {
            command_data.message.channel.send(`No osu! profile found! (You can set one with \`${command_data.guild_data.prefix}osuset <username>\`)`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const embedOsu = {
            color: 8388736,
            author: {
                name: `osu! stats for ${command_data.tagged_user_data.osu_username}`,
                icon_url: `http://s.ppy.sh/a/${user.id}`,
                url: `https://osu.ppy.sh/users/${user.id}`,
            },
            description:
                `**▸ Rank:** #${user.pp.rank} (${user.country} #${user.pp.countryRank})\n` +
                `**▸ Level:** ${Math.floor(user.level)} (${((user.level - Math.floor(user.level)) * 100).toFixed(2)}%)\n` +
                `**▸ Total PP:** ${user.pp.raw}\n` +
                `**▸ Accuracy:** ${user.accuracy.toFixed(2)}%\n` +
                `**▸ Playcount:** ${user.counts.plays}`,
            thumbnail: {
                url: `http://s.ppy.sh/a/${user.id}`,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedOsu] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
