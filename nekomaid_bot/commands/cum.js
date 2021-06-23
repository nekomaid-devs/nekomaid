module.exports = {
    name: 'cum',
    category: 'NSFW',
    description: 'Sends a random lewd cum image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.cum().catch(e => { console.log(e); });
    
        //Construct embed
            var embedCum = {
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
        data.channel.send("", { embed: embedCum }).catch(e => { console.log(e); });
    },
};