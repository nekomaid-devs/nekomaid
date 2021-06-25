const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "neko",
    category: "Fun",
    description: "Sends a random image of a neko-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.neko().catch(e => { console.log(e); });
        let embedNeko = {
            title: "Here's a neko, just for you-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }
        
        command_data.msg.channel.send("", { embed: embedNeko }).catch(e => { console.log(e); });
    },
};