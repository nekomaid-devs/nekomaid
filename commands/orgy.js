module.exports = {
    name: "orgy",
    category: "NSFW",
    description: "Sends a random lewd orgy image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.orgy().catch(e => { command_data.global_context.logger.api_error(e); });
        let embedOrgy = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }
        
        command_data.msg.channel.send("", { embed: embedOrgy }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};