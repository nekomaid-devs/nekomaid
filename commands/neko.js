const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'neko',
    category: 'Fun',
    description: 'Sends a random image of a neko-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Get random image
        const imageURL = await data.bot.akaneko.neko().catch(e => { console.log(e); });

        //Construct embed
        var embedNeko = {
            title: `Here's a neko, just for you-`,
            color: 8388736,
            image: {
                url: imageURL
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }

        //Send message
        data.channel.send("", { embed: embedNeko }).catch(e => { console.log(e); });
    },
};