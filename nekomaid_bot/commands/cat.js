module.exports = {
    name: 'cat',
    category: 'Fun',
    description: 'Sends a random image of a cat-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Get random image
        var obj = await data.bot.neko.sfw.meow()

        //Construct embed
        var embedCat = {
            title: `Here's a cat, just for you-`,
            color: 8388736,
            image: {
                url: obj.url
            },
            footer: {
                text: "Requested by " + data.authorTag
            }
        }

        //Send message
        data.channel.send("", { embed: embedCat }).catch(e => { console.log(e); });
    },
};