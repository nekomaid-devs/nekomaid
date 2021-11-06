/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { get_top_server_level } from "../scripts/utils/util_sort_by";

export default {
    name: "leveltop",
    category: "Leveling",
    description: "Displays people with highest level from this server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.server_config.module_level_enabled === false) {
            command_data.msg.reply(`Leveling isn't enabled on this server. (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        const top_text = "⚡ Server Level";
        const items = await get_top_server_level(command_data.global_context, command_data.server_config, command_data.msg.guild);
        const embedTop = new command_data.global_context.modules.Discord.MessageEmbed().setColor(8388736).setTitle(`❯    Top - \`${top_text}\``);

        let author_pos = -1;
        let author_config = null;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.user_ID === command_data.msg.author.id) {
                author_pos = i;
                author_config = user;
                break;
            }
        }
        if (author_config === null) {
            return;
        }

        const limit = items.length < 10 ? items.length : 10;
        for (let i = 0; i < limit; i += 1) {
            let user_config = items[i];
            const net = user_config.level;
            if (i === 8 && author_pos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if (i === 9 && author_pos > 10) {
                user_config = author_config;
                i = author_pos;
            }

            const net_2 = (user_config.xp / command_data.global_context.utils.get_level_XP(command_data.server_config, user_config)) * 100;
            const target_user = await command_data.global_context.bot.users.fetch(user_config.user_ID).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (target_user === null) {
                return;
            }
            embedTop.addField(`${i + 1}) ${target_user.tag}`, `Level ${net} (${Math.round(net_2)} %)`);
        }

        command_data.msg.channel.send({ embeds: [ embedTop ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
