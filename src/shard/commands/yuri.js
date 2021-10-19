module.exports = {
    name: "yuri",
    category: "NSFW",
    description: "Sends a random lewd yuri image.",
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
        let url = await command_data.global_context.modules.akaneko.nsfw.yuri().catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
        let embedYuri = {
            title: "Here are your lewds~",
            color: 8388736,
            image: {
                url: url,
            },
            footer: {
                text: "Powered by Akaneko 💖",
            },
        };

        command_data.msg.channel.send({ embeds: [embedYuri] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
