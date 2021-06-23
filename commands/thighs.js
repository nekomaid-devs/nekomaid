module.exports = {
    name: 'thighs',
    category: 'NSFW',
    description: 'Sends a random lewd picture of thighs-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(data) {
        //Get random image
        var lewdURL = await data.bot.akaneko.nsfw.thighs().catch(e => { console.log(e); });

        //Construct embed
        var embedThighs = {
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
        data.channel.send("", { embed: embedThighs }).catch(e => { console.log(e); });
    },
};