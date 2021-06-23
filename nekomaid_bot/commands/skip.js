module.exports = {
    name: 'skip',
    category: 'Music',
    description: "Skips a song from the queue-",
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
        var voiceRequest = data.bot.vm.connections.get(data.guild.id).current;
        voiceData.current.stream.destroy();
        voiceData.current = -1;

        data.channel.send("Skipped `" + voiceRequest.info.title + "`- (`" + data.bot.vm.connections.get(data.guild.id).queue.length + "` remaining)-").catch(e => { console.log(e); });
        console.log("- [voice] Skipped VoiceRequest in VoiceConnection(id: " + data.guild.id + ", size: " + voiceData.queue.length + ")");
        
        if(voiceData.mode === 0) {
            voiceData.persistentQueue.shift();
        }

        data.bot.vm.tryPlayingNext(data.bot, data.guild.id);
    },
};