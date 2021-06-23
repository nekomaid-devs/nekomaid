module.exports = {
    name: 'dog',
    category: 'Fun',
    description: 'Sends a random image of a dog-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Get random image
        var obj = await data.bot.neko.sfw.woof()

        //Construct embed
        var embedDog = {
            title: `Here's a dog, just for you-`,
            color: 8388736,
            image: {
                url: obj.url
            },
            footer: {
                text: "Requested by " + data.authorTag
            }
        }

        //Send message
        data.channel.send("", { embed: embedDog }).catch(e => { console.log(e); });
    },
};