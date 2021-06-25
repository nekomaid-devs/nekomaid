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
        // TODO: re-factor command
        //Get random image from rule34
        try {
            var postInfo = await data.bot.gelbooru.gelbooru_result(data.bot.r34, command_data.args);
        } catch(err) {
            console.log(err);
            command_data.msg.reply("There was an error in processing this request-");
            return;
        }

        switch(postInfo.status) {
            case 0:
                command_data.msg.reply("No results found-");
                return;

            case 2:
                command_data.msg.reply("Failed all possible tries(5)- Try again...");
                return;
        }

        //Construct embed
        var postsNumber0 = (postInfo.pageNumber - 1) * 42;
        var postNumber = postsNumber0 + postInfo.postNumber;

        var numOfPosts = postInfo.numOfPages * 42;

        let embedRule34 = {
            title: `Here is result for ${command_data.args[0]}`,
            color: 8388736,
            fields: [ 
                {
                    name: 'Image Link:',
                    value: `[Click Here](${postInfo.link})`
                }
            ],
            image: {
                url: postInfo.link
            },
            footer: {
                text: `Page: ${postInfo.pageNumber}/${postInfo.numOfPages} Post: ${postNumber}/${numOfPosts}`
            }
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedRule34 }).catch(e => { console.log(e); });
    },
};