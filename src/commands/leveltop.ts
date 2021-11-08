/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_top_guild_level } from "../scripts/utils/util_sort";
import { get_guild_level_XP } from "../scripts/utils/util_general";

export default {
    name: "leveltop",
    category: "Leveling",
    description: "Displays people with highest level from this server.",
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
        if (command_data.guild_data.module_level_enabled === false) {
            command_data.message.reply(`Leveling isn't enabled on this server. (see \`${command_data.guild_data.prefix}leveling\` for help)`);
            return;
        }

        const top_text = "⚡ Server Level";
        const items = await get_top_guild_level(command_data.global_context, command_data.guild_data, command_data.message.guild);
        const embedTop = new command_data.global_context.modules.Discord.MessageEmbed().setColor(8388736).setTitle(`❯    Top - \`${top_text}\``);

        let author_pos = -1;
        let author_data = null;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.user_ID === command_data.message.author.id) {
                author_pos = i;
                author_data = user;
                break;
            }
        }
        if (author_data === null) {
            return;
        }

        const limit = items.length < 10 ? items.length : 10;
        for (let i = 0; i < limit; i += 1) {
            let user_data = items[i];
            const net = user_data.level;
            if (i === 8 && author_pos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if (i === 9 && author_pos > 10) {
                user_data = author_data;
                i = author_pos;
            }

            const net_2 = (user_data.xp / get_guild_level_XP(command_data.guild_data, user_data)) * 100;
            const target_user = await command_data.global_context.bot.users.fetch(user_data.user_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (target_user === null) {
                return;
            }
            embedTop.addField(`${i + 1}) ${target_user.tag}`, `Level ${net} (${Math.round(net_2)} %)`);
        }

        command_data.message.channel.send({ embeds: [embedTop] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
