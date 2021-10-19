module.exports = {
    name: "maid",
    category: "NSFW",
    description: "Sends a random lewd maid image.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: true,
    cooldown: 1500,
    async execute(command_data) {
        let url = await command_data.global_context.modules.akaneko.nsfw.maid().catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
        let embedMaid = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url,
            },
            footer: {
                text: "Powered by Akaneko 💖",
            },
        };

        command_data.msg.channel.send({ embeds: [embedMaid] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
