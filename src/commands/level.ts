/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { get_top_guild_level } from "../scripts/utils/util_sort";
import { get_level_XP } from "../scripts/utils/util_general";

export default {
    name: "level",
    category: "Leveling",
    description: "Displays the tagged user's server profile.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["lvl"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.tagged_user === undefined || command_data.bot_data === null) {
            return;
        }
        if (command_data.guild_data.module_level_enabled === false) {
            command_data.message.reply(`Leveling isn't enabled on this server. (see \`${command_data.guild_data.prefix}leveling\` for help)`);
            return;
        }

        const items = await get_top_guild_level(command_data.global_context, command_data.guild_data, command_data.message.guild);
        let author_pos = -1;
        let author_data = null;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.user_ID === command_data.tagged_user.id) {
                author_data = user;
                author_pos = i;
                break;
            }
        }
        if (author_data === null) {
            return;
        }
        author_pos += 1;

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedLevel = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile (${author_pos}#)`,
                icon_url: url === null ? undefined : url,
            },
            fields: [
                {
                    name: "⚡    Server Level:",
                    value: `${author_data.level} (XP: ${Math.round(author_data.xp)}/${Math.round(get_level_XP(command_data.bot_data))})`,
                },
            ],
            thumbnail: {
                url: url === null ? undefined : url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedLevel] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
