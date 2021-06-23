module.exports = {
    name: 'nsfwgif',
    category: 'NSFW',
    description: 'Sends a random lewd gif-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.gif().catch(e => { console.log(e); });

        //Construct embed
        var embedGif = {
            title: `Here are your lewds-`,
            color: 8388736,
            image: {
                url: lewdURL
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        //Send message
        data.channel.send("", { embed: embedGif }).catch(e => { console.log(e); });
    },
};