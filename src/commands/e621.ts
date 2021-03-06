/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { e621_result } from "../scripts/apis/api_e621";

export default {
    name: "e621",
    category: "NSFW",
    description: "Posts an image from e621 with specified tag (or filters out tag with at beginning of the tag !)",
    helpUsage: "[?tag/!tag]`",
    exampleUsage: "",
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
        const post_info = await e621_result(command_data.global_context, command_data.args);
        if (post_info === null) {
            command_data.message.reply("No results found...");
            return;
        }

        const embedE621 = {
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
        command_data.message.channel.send({ embeds: [embedE621] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
