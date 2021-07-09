const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "rule34",
    category: "NSFW",
    description: "Posts an image from rule34 with specified tag (or filters out tag with !)",
    helpUsage: "[tag/!tag]`",
    exampleUsage: "ass",
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
        let post_info = await command_data.global_context.neko_modules_clients.r34.rule34_result(command_data.global_context, command_data.args);
        switch(post_info.status) {
            case -1:
                command_data.msg.reply("No results found...");
                return;
        }

        let embedRule34 = {
            title: `Here is result for ${command_data.args[0]}`,
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
        command_data.msg.channel.send("", { embed: embedRule34 }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};