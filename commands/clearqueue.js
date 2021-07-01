module.exports = {
    name: "clearqueue",
    category: "Music",
    description: "Clears the current queue-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: this should skip the current song
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            command_data.msg.reply("I'm not in a voice channel-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        voice_data.queue = [];
        voice_data.persistent_queue = [];

        command_data.msg.channel.send("Cleared the current queue-").catch(e => { console.log(e); });
    },
};