module.exports = {
    name: "leave",
    category: "Music",
    description: "Leaves the voice channel-",
    helpUsage: "`",
    hidden: false,
    aliases: ["stop"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            command_data.msg.reply("I'm not in a voice channel-");
            return;
        }

        command_data.global_context.neko_modules_clients.vm.removeConnection(command_data, command_data.msg.guild.id);
        command_data.msg.channel.send("Left the voice channel-").catch(e => { console.log(e); });
    },
};