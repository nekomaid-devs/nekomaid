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
        let post_info = -1;
        try {
            post_info = await command_data.global_context.neko_modules_clients.nhentai.nhentai_result(command_data.global_context, command_data.args[0]);
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

        let tags_text = "";
        post_info.tags.forEach((tag, index) => {
            tags_text += "`" + tag.split("-").join(" ") + "`";
            if(post_info.tags.length - 1 > index) {
                tags_text += ", ";
            }
        })

        let languages_text = "";
        post_info.languages.forEach((language, index) => {
            languages_text += "`" + language + "`"
            if(post_info.languages.length - 1 > index) {
                languages_text += ", ";
            }
        })

        let embedNHentai = {
            title: `Sauce for - ${command_data.args[0]}`,
            color: 8388736,
            url: `https://nhentai.net/g/${command_data.args[0]}`,
            thumbnail: {
                url: post_info.thumbnailURL,
            },
            fields: [
                {
                    name: 'Title:',
                    value: `\`${post_info.title}\``
                },
                {
                    name: 'Pages:',
                    value: `\`${post_info.numOfPages}\``
                },
                {
                    name: 'Tags:',
                    value: tags_text
                },
                {
                    name: 'Languages:',
                    value: languages_text
                },
                {
                    name: 'Favourites:',
                    value: `\`${post_info.favourites}\``
                }
            ],
            footer: {
                text: `Requested by ${command_data.msg.author.tag}...`
            }
        }
        command_data.msg.channel.send("", { embed: embedNHentai }).catch(e => { console.log(e); });
    },
};