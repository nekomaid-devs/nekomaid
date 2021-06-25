module.exports = {
    name: "shuffle",
    category: "Music",
    description: "Randomizes the current queue-",
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

        if(voiceData.mode === 0) {
            voiceData.queue = voiceData.queue
            .map(a =>
                ({ sort: Math.random(), value: a })
            )
            .sort((a, b) =>
                a.sort - b.sort
            )
            .map(a =>
                a.value
            )

            voiceData.persistentQueue = [ voiceData.current ];
            voiceData.queue.forEach(voiceRequest => {
                voiceData.persistentQueue.push(voiceRequest)
            })

            command_data.msg.channel.send("Shuffled `" + voiceData.queue.length + "` songs-").catch(e => { console.log(e); });
        } else {
            var voiceData2 = data.bot.vm.connections.get(command_data.msg.guild.id);
            voiceData2.persistentQueue = voiceData2.persistentQueue
            .map(a =>
                ({ sort: Math.random(), value: a })
            )
            .sort((a, b) =>
                a.sort - b.sort
            )
            .map(a =>
                a.value
            )

            var currentPersistentIndex = voiceData.persistentQueue.length;
            var i1 = 0;
            voiceData.queue = []
            voiceData.persistentQueue.forEach(voiceRequest => {
                if(voiceRequest.uuid === voiceData.current.uuid) {
                    currentPersistentIndex = i1;
                }

                if(currentPersistentIndex < i1) {
                    voiceData.queue.push(voiceRequest)
                }

                i1 += 1;
            })

            command_data.msg.channel.send("Shuffled `" + voiceData.persistentQueue.length + "` songs-").catch(e => { console.log(e); });
        }

        console.log("- [voice] Shuffled VoiceRequests in VoiceConnection(id: " + command_data.msg.guild.id + ", size: " + voiceData.queue.length + ")");
    },
};