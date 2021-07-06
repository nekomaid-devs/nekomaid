const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "safebooru",
    category: "Utility",
    description: "Posts an image from safebooru with specified tag (or filters out tag with at beginning of the tag !)",
    helpUsage: "[?tag/!tag]`",
    exampleUsage: "catgirl",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a tag- (ex. `catgirl`, `foxgirl`, ...)", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let post_info = await command_data.global_context.neko_modules_clients.safebooru.safebooru_result(command_data.global_context, command_data.args);
        switch(post_info.status) {
            case -1:
                command_data.msg.reply("No results found-");
                return;
        }

        let embedSafebooru = {
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
                text: `Page: ${post_info.page_number}/${post_info.num_of_pages} Post: ${post_info.post_number}/${post_info.num_of_posts}`
            }
        }
        command_data.msg.channel.send("", { embed: embedSafebooru }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};