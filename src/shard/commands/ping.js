module.exports = {
    name: "ping",
    category: "Help & Information",
    description: "Checks the bot's ping",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let message = await command_data.msg.channel.send("Ping?").catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
        let embedPing = {
            color: 8388736,
            fields: [
                {
                    name: "🏓 Ping",
                    value: `${message.createdTimestamp - command_data.msg.createdTimestamp}ms`,
                },
                {
                    name: "🏠 API",
                    value: `${Math.round(command_data.global_context.bot.ws.ping)}ms`,
                },
            ],
        };

        message.edit({ embeds: [embedPing] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
