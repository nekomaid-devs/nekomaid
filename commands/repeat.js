module.exports = {
    name: "repeat",
    category: "Music",
    description: "Repeats the current queue of songs-",
    helpUsage: "`",
    hidden: false,
    aliases: ["loop"],
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
        voice_data.mode = voice_data.mode === 0 ? 1 : 0;
        if(voice_data.mode === 1) {
            command_data.msg.channel.send("Repeating current queue-").catch(e => { console.log(e); });
        } else {
            command_data.msg.channel.send("Stopped repeating current queue-").catch(e => { console.log(e); });
        }
    },
};