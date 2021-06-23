const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'nhentai',
    category: 'NSFW',
    description: 'Finds a doujinshi with id-',
    helpUsage: "[sauce?]` *(optional argument)*",
    exampleUsage: "177013",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a sauce- (ex. `177013`)", "none")
    ],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image from rule34
        var sauce = data.args[0];

        try {
            var postInfo = await data.bot.nhentai.nhentai_result(data.bot.nhentai, sauce);
        } catch(err) {
            console.error(err);
            data.reply("There was an error in processing this request-");
            return;
        }

        switch(postInfo.status) {
            case 0:
                data.reply("No results found-");
                return;
        }

        if(postInfo.tags.includes("lolicon") === true || postInfo.tags.includes("shotacon") === true) {
            data.reply("Sorry, I cannot show this due to chance of violating the Discord TOS- (`loli`/`shota` content)");
            return;
        }

        var tagsText = "";
        postInfo.tags.forEach(function(tag, index) {
            tagsText += "`" + tag.split("-").join(" ") + "`"

            if(postInfo.tags.length - 1 > index) {
                tagsText += ", ";
            }
        })

        var languagesText = "";
        postInfo.languages.forEach(function(language, index) {
            languagesText += "`" + language + "`"

            if(postInfo.languages.length - 1 > index) {
                languagesText += ", ";
            }
        })

        //Construct embed
        var embedNHentai = {
            title: "Sauce for - " + sauce,
            color: 8388736,
            url: "https://nhentai.net/g/" + sauce,
            thumbnail: {
                url: postInfo.thumbnailURL,
            },
            fields: [
                {
                    name: 'Title:',
                    value: "`" + postInfo.title + "`"
                },
                {
                    name: 'Pages:',
                    value: "`" + postInfo.numOfPages + "`"
                },
                {
                    name: 'Tags:',
                    value: `${tagsText}`
                },
                {
                    name: 'Languages:',
                    value: `${languagesText}`
                },
                {
                    name: 'Favourites:',
                    value: "`" + postInfo.favourites + "`"
                }
            ],
            footer: {
                text: `Requested by ${data.authorTag}...`
            }
        }

        //Send message
        data.channel.send("", { embed: embedNHentai }).catch(e => { console.log(e); });
    },
};