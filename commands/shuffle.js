module.exports = {
    name: "shuffle",
    category: "Music",
    description: "Randomizes the current queue.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        if(voice_data.mode === 0) {
            voice_data.queue = command_data.global_context.utils.shuffle_playlist(voice_data.queue);
            voice_data.persistent_queue = [ voice_data.current ];
            voice_data.queue.forEach(voiceRequest => {
                voice_data.persistent_queue.push(voiceRequest);
            })

            command_data.msg.channel.send(`Shuffled \`${voice_data.queue.length}\` songs-`).catch(e => { console.log(e); });
        } else {
            voice_data.persistent_queue = command_data.global_context.utils.shuffle_playlist(voice_data.persistent_queue);

            let currentPersistentIndex = voice_data.persistent_queue.length;
            let i = 0;
            voice_data.queue = []
            voice_data.persistent_queue.forEach(voice_request => {
                if(voice_request.uuid === voice_data.current.uuid) {
                    currentPersistentIndex = i;
                }
                if(currentPersistentIndex < i) {
                    voice_data.queue.push(voice_request);
                }

                i += 1;
            });

            command_data.msg.channel.send(`Shuffled \`${voice_data.persistent_queue.length}\` songs-`).catch(e => { console.log(e); });
        }
    },
};