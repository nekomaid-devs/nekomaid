/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { danbooru_result } from "../scripts/apis/api_danbooru";

export default {
    name: "danbooru",
    category: "NSFW",
    description: "Posts an image from danbooru with specified tag (or filters out tag with at beginning of the tag !)",
    helpUsage: "[?tag/!tag]`",
    exampleUsage: "ass",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a tag- (ex. `ass`, `catgirl`, `foxgirl`, ...)", "none", true)],
    permissions: [],
    nsfw: true,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const post_info = await danbooru_result(command_data.global_context, command_data.args);
        if (post_info === null) {
            command_data.message.reply("No results found...");
            return;
        }

        const embedDanbooru = {
            title: `Here is result for ${command_data.total_argument}`,
            color: 8388736,
            fields: [
                {
                    name: "Image Link:",
                    value: `[Click Here](${post_info.link})`,
                },
            ],
            image: {
                url: post_info.link,
            },
            footer: {
                text: `Page: ${post_info.page_number}/${post_info.num_of_pages} Post: ${post_info.post_number}/${post_info.num_of_posts}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedDanbooru] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
