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
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        if(voice_data.connection.dispatcher.paused === false) {
            voice_data.connection.dispatcher.pause();
            command_data.msg.channel.send("Paused current song-").catch(e => { console.log(e); });
        } else {
            voice_data.connection.dispatcher.resume();
            command_data.msg.channel.send("Resuming current song-").catch(e => { console.log(e); });
        }
    },
};