const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'danbooru',
    category: 'NSFW',
    description: 'Posts an image from danbooru with specified tag (or filters out tag with at beginning of the tag !)',
    helpUsage: "[?tag/!tag]`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a tag- (ex. `ass`, `catgirl`, `foxgirl`, ...)", "none")
    ],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image from safebooru
        try {
            var postInfo = await data.bot.danbooru.danbooru_result(data.bot.danbooru, data.args);
        } catch(err) {
            console.error(err);
            data.reply("There was an error in processing this request-");
            return;
        }

        switch(postInfo.status) {
            case 0:
                data.reply("No results found-");
                return;

            case -1:
                data.reply("Required tag doesn't exist-");
                return;
        }

        //Construct embed
        var postsNumber0 = (postInfo.pageNumber - 1) * 100;
        var postNumber = postsNumber0 + postInfo.postNumber;
        var numOfPosts = postInfo.numOfPosts;

        var embedDanbooru = {
            title: `Here is result for ${data.args.join(" ")}`,
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
        data.channel.send("", { embed: embedDanbooru }).catch(e => { console.log(e); });
    },
};