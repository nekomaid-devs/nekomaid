module.exports = {
    name: 'pussy',
    category: 'NSFW',
    description: 'Sends a random lewd pussy image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.pussy().catch(e => { console.log(e); });
    
        //Construct embed
        var embedPussy = {
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
        data.channel.send("", { embed: embedPussy }).catch(e => { console.log(e); });
    },
};