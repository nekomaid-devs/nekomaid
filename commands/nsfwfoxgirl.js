module.exports = {
    name: "nsfwfoxgirl",
    category: "NSFW",
    description: "Sends a random lewd foxgirl image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.foxgirl().catch(e => { console.log(e); });
        let embedFoxgirl = {
            title: "Here are your lewds-",
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