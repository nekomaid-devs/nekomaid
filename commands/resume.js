module.exports = {
    name: "resume",
    category: "Music",
    description: "Resumes the current song",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing!");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        if(voice_data.connection.dispatcher.paused === true) {
            voice_data.connection.dispatcher.resume();
            command_data.msg.channel.send("Resumed current song~").catch(e => { console.log(e); });
        } else {
            command_data.msg.channel.send("The song is already resumed.").catch(e => { console.log(e); });
        }
    },
};