module.exports = {
    name: 'pause',
    category: 'Music',
    description: "Pauses the current song-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
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

        if(voiceData.connection.dispatcher.paused === false) {
            voiceData.connection.dispatcher.pause();
            data.channel.send("Paused current song-").catch(e => { console.log(e); });
            console.log("- [voice] Paused VoiceRequest in VoiceConnection(id: " + data.guild.id + ")");
        } else {
            voiceData.connection.dispatcher.resume();
            data.channel.send("Resuming current song-").catch(e => { console.log(e); });
            console.log("- [voice] Resumed VoiceRequest in VoiceConnection(id: " + data.guild.id + ")");
        }
    },
};