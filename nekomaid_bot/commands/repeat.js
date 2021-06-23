module.exports = {
    name: 'repeat',
    category: 'Music',
    description: "Repeats the current queue of songs-",
    helpUsage: "`",
    hidden: false,
    aliases: ["loop"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        if(data.bot.vm.connections.has(data.guild.id) === false || data.bot.vm.connections.get(data.guild.id).current === -1) {
            data.reply("There's nothing playing-");
            return;
        }

        var voiceData = data.bot.vm.connections.get(data.guild.id);
        voiceData.mode = voiceData.mode === 0 ? 1 : 0;

        if(voiceData.mode === 1) {
            data.channel.send("Repeating current queue-").catch(e => { console.log(e); });
            console.log("- [voice] Set mode to 1 in VoiceConnection(id: " + data.guild.id + ")");
        } else {
            data.channel.send("Stopped repeating current queue-").catch(e => { console.log(e); });
            console.log("- [voice] Set mode to 0 in VoiceConnection(id: " + data.guild.id + ")");
        }
    },
};