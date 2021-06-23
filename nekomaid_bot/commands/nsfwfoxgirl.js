module.exports = {
    name: 'nsfwfoxgirl',
    category: 'NSFW',
    description: 'Sends a random lewd foxgirl image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.foxgirl().catch(e => { console.log(e); });
    
        //Construct embed
        var embedFoxgirl = {
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
        data.channel.send("", { embed: embedFoxgirl }).catch(e => { console.log(e); });
    },
};