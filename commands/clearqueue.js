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
        // TODO: re-factor command
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            data.msg.reply("I'm not in a voice channel-");
            return;
        }

        let voiceData = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        voiceData.queue = [];
        voiceData.persistentQueue = [];

        command_data.msg.channel.send("Cleared the current queue-").catch(e => { console.log(e); });
    },
};