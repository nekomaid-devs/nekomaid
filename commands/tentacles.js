module.exports = {
    name: 'tentacles',
    category: 'NSFW',
    description: 'Sends a random lewd image-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.tentacles().catch(e => { console.log(e); });

        //Construct embed
        var embedTentacles = {
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
        data.channel.send("", { embed: embedTentacles }).catch(e => { console.log(e); });
    },
};