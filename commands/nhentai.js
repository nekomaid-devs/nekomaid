const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "nhentai",
    category: "NSFW",
    description: "Finds a doujinshi with id-",
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
    async execute(command_data) {
        // TODO: re-factor command
        //Get random image from rule34
        var sauce = command_data.args[0];

        try {
            var post_info = await command_data.global_context.neko_modules_clients.nhentai.nhentai_result(command_data.global_context, sauce);
        } catch(err) {
            console.error(err);
            command_data.msg.reply("There was an error in processing this request-");
            return;
        }

        switch(post_info.status) {
            case 0:
                command_data.msg.reply("No results found-");
                return;
        }

        if(post_info.tags.includes("lolicon") === true || post_info.tags.includes("shotacon") === true) {
            command_data.msg.reply("Sorry, I cannot show this due to chance of violating the Discord TOS- (`loli`/`shota` content)");
            return;
        }

        var tagsText = "";
        post_info.tags.forEach(function(tag, index) {
            tagsText += "`" + tag.split("-").join(" ") + "`"

            if(post_info.tags.length - 1 > index) {
                tagsText += ", ";
            }
        })

        var languagesText = "";
        post_info.languages.forEach(function(language, index) {
            languagesText += "`" + language + "`"

            if(post_info.languages.length - 1 > index) {
                languagesText += ", ";
            }
        })

        //Construct embed
        let embedNHentai = {
            title: "Sauce for - " + sauce,
            color: 8388736,
            url: "https://nhentai.net/g/" + sauce,
            thumbnail: {
                url: post_info.thumbnailURL,
            },
            fields: [
                {
                    name: 'Title:',
                    value: "`" + post_info.title + "`"
                },
                {
                    name: 'Pages:',
                    value: "`" + post_info.numOfPages + "`"
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
                    value: "`" + post_info.favourites + "`"
                }
            ],
            footer: {
                text: `Requested by ${command_data.msg.author.tag}...`
            }
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedNHentai }).catch(e => { console.log(e); });
    },
};