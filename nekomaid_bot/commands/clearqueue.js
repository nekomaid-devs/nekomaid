module.exports = {
    name: 'clearqueue',
    category: 'Music',
    description: "Clears the current queue-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        if(data.bot.vm.connections.has(data.guild.id) === false) {
            data.msg.reply("I'm not in a voice channel-");
            return;
        }

        var voiceData = data.bot.vm.connections.get(data.guild.id);
        voiceData.queue = []
        voiceData.persistentQueue = []

        data.channel.send("Cleared the current queue-").catch(e => { console.log(e); });
    },
};