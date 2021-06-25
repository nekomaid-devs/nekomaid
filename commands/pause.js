module.exports = {
    name: "pause",
    category: "Music",
    description: "Pauses the current song-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(data.bot.vm.connections.has(command_data.msg.guild.id) === false || data.bot.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing-");
            return;
        }

        var voiceData = data.bot.vm.connections.get(command_data.msg.guild.id);

        if(voiceData.connection.dispatcher.paused === false) {
            voiceData.connection.dispatcher.pause();
            command_data.msg.channel.send("Paused current song-").catch(e => { console.log(e); });
            console.log("- [voice] Paused VoiceRequest in VoiceConnection(id: " + command_data.msg.guild.id + ")");
        } else {
            voiceData.connection.dispatcher.resume();
            command_data.msg.channel.send("Resuming current song-").catch(e => { console.log(e); });
            console.log("- [voice] Resumed VoiceRequest in VoiceConnection(id: " + command_data.msg.guild.id + ")");
        }
    },
};