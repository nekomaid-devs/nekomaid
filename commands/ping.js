module.exports = {
    name: "ping",
    category: "Help & Information",
    description: "Checks the bot's ping",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let m = await command_data.msg.channel.send("Ping?").catch(e => { console.log(e); });
        let embedPing = {
            color: 8388736,
            fields: [
                {
                    name: "🏓 Ping",
                    value: `${(m.createdTimestamp - command_data.msg.createdTimestamp)}ms`
                },
                {
                    name: "🏠 API",
                    value: `${Math.round(command_data.bot.ws.ping)}ms`
                }
            ]
        }

        m.edit("", { embed: embedPing });
    },
};