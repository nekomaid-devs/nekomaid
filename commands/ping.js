module.exports = {
    name: 'ping',
    category: 'Help & Information',
    description: "Checks the bot's ping",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Send message
        const m = await data.channel.send("Ping?").catch(e => { console.log(e); });

        var embedPing = {
            color: 8388736,
            fields: [
                {
                    name: "🏓 Ping",
                    value: `${m.createdTimestamp - data.msg.createdTimestamp}ms`
                },
                {
                    name: "🏠 API",
                    value: `${Math.round(data.bot.ws.ping)}ms`
                }
            ]
        }

        m.edit("", { embed: embedPing });
    },
};