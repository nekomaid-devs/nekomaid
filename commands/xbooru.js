const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "xbooru",
    category: "NSFW",
    description: "Posts an image from xbooru with specified tag (or filters out tag with !)",
    helpUsage: "[tag/!tag]`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a tag- (ex. `ass`, `catgirl`, `foxgirl`, ...)", "none")
    ],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let post_info = -1;
        try {
            post_info = await command_data.bot.xbooru.gelbooru_result(command_data.bot.xbooru, command_data.args);
        } catch(err) {
            console.log(err);
            command_data.msg.reply("There was an error in processing this request-");
            return;
        }

        switch(post_info.status) {
            case 0:
                command_data.msg.reply("No results found-");
                return;

            case 2:
                command_data.msg.reply("Failed all possible tries(5)- Try again...");
                return;
        }

        let posts_number_0 = (postInfo.pageNumber - 1) * 42;
        let post_number = posts_number_0 + postInfo.postNumber;
        let num_of_posts = postInfo.numOfPosts * 42;
        let embedXbooru = {
            title: `Here is result for ${command_data.args[0]}`,
            color: 8388736,
            fields: [ 
                {
                    name: "Image Link:",
                    value: `[Click Here](${post_info.link})`
                }
            ],
            image: {
                url: postInfo.link
            },
            footer: {
                text: `Page: ${postInfo.pageNumber}/${postInfo.numOfPages} Post: ${post_number}/${num_of_posts}`
            }
        }
        command_data.msg.channel.send("", { embed: embedXbooru }).catch(e => { console.log(e); });
    },
};