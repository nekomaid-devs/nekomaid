module.exports = {
    name: "foxgirl",
    category: "Fun",
    description: "Sends a random image of a foxgirl-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.foxgirl().catch(e => { console.log(e); });
        let embedFoxgirl = {
            title: "Here's a foxgirl, just for you-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }
        
        command_data.msg.channel.send("", { embed: embedFoxgirl }).catch(e => { console.log(e); });
    },
};