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
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        let voice_request = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current;
        voice_data.current.stream.destroy();
        voice_data.current = -1;

        command_data.msg.channel.send(`Skipped \`${voice_request.info.title}\`- (\`${command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).queue.length}\` remaining)-`).catch(e => { console.log(e); });
        if(voice_data.mode === 0) {
            voice_data.persistentQueue.shift();
        }

        command_data.global_context.neko_modules_clients.vm.try_playing_next(command_data.global_context, command_data.msg.guild.id);
    },
};