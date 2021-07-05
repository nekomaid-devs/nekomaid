const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "e621",
    category: "NSFW",
    description: "Posts an image from e621 with specified tag (or filters out tag with at beginning of the tag !)",
    helpUsage: "[?tag/!tag]`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a tag- (ex. `ass`, `catgirl`, `foxgirl`, ...)", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        // TODO: API doesn't work anymore
        let post_info = -1;
        try {
            post_info = await command_data.global_context.neko_modules_clients.e621.e621_result(command_data.global_context, command_data.args);
        } catch(err) {
            global_context.logger.error(err);
            command_data.msg.reply("There was an error in processing this request-");
            return;
        }

        switch(post_info.status) {
            case 0:
                command_data.msg.reply("No results found-");
                return;

            case -1:
                command_data.msg.reply("Required tag doesn't exist-");
                return;
        }

        let posts_number_0 = (post_info.pageNumber - 1) * 100;
        let post_number = posts_number_0 + post_info.postNumber;
        let num_of_posts = post_info.numOfPosts;
        let embedE621 = {
            title: `Here is result for ${command_data.total_argument}`,
            color: 8388736,
            fields: [ 
                {
                    name: "Image Link:",
                    value: `[Click Here](${post_info.link})`
                }
            ],
            image: {
                url: post_info.link
            },
            footer: {
                text: `Page: ${post_info.pageNumber}/${post_info.numOfPages} Post: ${post_number}/${num_of_posts}`
            }
        }
        command_data.msg.channel.send("", { embed: embedE621 }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};