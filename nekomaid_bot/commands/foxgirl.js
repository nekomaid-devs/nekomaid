module.exports = {
    name: 'foxgirl',
    category: 'Fun',
    description: 'Sends a random image of a foxgirl-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Get random image
        const imageURL = await data.bot.akaneko.foxgirl().catch(e => { console.log(e); });

        //Construct embed
        var embedFoxgirl = {
            title: `Here's a foxgirl, just for you-`,
            color: 8388736,
            image: {
                url: imageURL
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        //Send message
        data.channel.send("", { embed: embedFoxgirl }).catch(e => { console.log(e); });
    },
};