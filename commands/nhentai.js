const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "nhentai",
    category: "NSFW",
    description: "Finds a doujinshi with id.",
    helpUsage: "[sauce?]` *(optional argument)*",
    exampleUsage: "177013",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a sauce- (ex. `177013`)", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let post_info = await command_data.global_context.neko_modules_clients.nhentai.nhentai_result(command_data.global_context, command_data.args[0]);
        switch(post_info.status) {
            case 0:
                command_data.msg.reply("No results found...");
                return;
        }

        if(post_info.tags.includes("lolicon") === true || post_info.tags.includes("shotacon") === true) {
            command_data.msg.reply("Sorry, I cannot show this due to chance of violating the Discord TOS. (`loli`/`shota` content)");
            return;
        }

        let tags_text = post_info.tags.reduce((acc, curr) => { acc += "`" + curr + "`, "; return acc; }, "");
        tags_text = tags_text.slice(0, tags_text.length - 2);
        if(tags_text === "") {
            tags_text = "`None`";
        }

        let languages_text = post_info.languages.reduce((acc, curr) => { acc += "`" + curr.toString() + "`, "; return acc; }, "");
        languages_text = languages_text.slice(0, languages_text.length - 2);
        if(languages_text === "") {
            languages_text = "`None`";
        }

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
                    value: `\`${post_info.num_of_pages}\``
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
        command_data.msg.channel.send("", { embed: embedNHentai }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};