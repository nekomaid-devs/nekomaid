module.exports = {
    name: 'bj',
    category: 'NSFW',
    description: 'Sends a random lewd blowjob image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.blowjob().catch(e => { console.log(e); });
    
        //Construct embed
        var embedBj = {
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
        data.channel.send("", { embed: embedBj }).catch(e => { console.log(e); });
    },
};