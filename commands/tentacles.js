module.exports = {
    name: "tentacles",
    category: "NSFW",
    description: "Sends a random lewd image-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.tentacles().catch(e => { console.log(e); });
        let embedTentacles = {
            title: "Here are your lewds-",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }
        
        command_data.msg.channel.send("", { embed: embedTentacles }).catch(e => { console.log(e); });
    },
};