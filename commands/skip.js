module.exports = {
    name: "skip",
    category: "Music",
    description: "Skips a song from the queue-",
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
        var voiceRequest = data.bot.vm.connections.get(command_data.msg.guild.id).current;
        voiceData.current.stream.destroy();
        voiceData.current = -1;

        command_data.msg.channel.send("Skipped `" + voiceRequest.info.title + "`- (`" + data.bot.vm.connections.get(command_data.msg.guild.id).queue.length + "` remaining)-").catch(e => { console.log(e); });
        console.log("- [voice] Skipped VoiceRequest in VoiceConnection(id: " + command_data.msg.guild.id + ", size: " + voiceData.queue.length + ")");
        
        if(voiceData.mode === 0) {
            voiceData.persistentQueue.shift();
        }

        data.bot.vm.tryPlayingNext(data.bot, command_data.msg.guild.id);
    },
};