module.exports = {
    name: 'bdsm',
    category: 'NSFW',
    description: 'Sends a random lewd bdsm image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.bdsm().catch(e => { console.log(e); });
    
        //Construct embed
        var embedBDSM = {
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
        data.channel.send("", { embed: embedBDSM }).catch(e => { console.log(e); });
    },
};