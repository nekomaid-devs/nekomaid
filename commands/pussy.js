module.exports = {
    name: "pussy",
    category: "NSFW",
    description: "Sends a random lewd pussy image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.pussy().catch(e => { command_data.global_context.logger.api_error(e); });
        let embedPussy = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url
            },
            footer: {
                text: "Powered by Akaneko 💖"
            }
        }
        
        command_data.msg.channel.send("", { embed: embedPussy }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};