/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";
import { get_top_server_level } from "../scripts/utils/util_sort_by";

export default {
    name: "level",
    category: "Leveling",
    description: "Displays the tagged user's server profile.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["lvl"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a mention.", "mention")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.tagged_user === undefined) {
            return;
        }
        if (command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server. (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        const items = await get_top_server_level(command_data.global_context, command_data.server_config, command_data.msg.guild);
        let author_pos = -1;
        let author_config;
        for (let i = 0; i < items.length; i += 1) {
            const user = items[i];
            if (user.user_ID === command_data.tagged_user.id) {
                author_config = user;
                author_pos = i;
                break;
            }
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
                    value: `${author_config.level} (XP: ${Math.round(author_config.xp)}/${Math.round(command_data.global_context.utils.get_level_XP(command_data.server_config, command_data.author_user_config))})`,
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedLevel] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
