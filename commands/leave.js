module.exports = {
    name: "leave",
    category: "Music",
    description: "Leaves the voice channel.",
    helpUsage: "`",
    hidden: false,
    aliases: ["stop"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: check for guild voice aswell
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            command_data.msg.reply("I'm not in a voice channel-");
            return;
        }

        command_data.global_context.neko_modules_clients.vm.remove_connection(command_data.global_context, command_data.msg.guild.id);
        command_data.msg.channel.send("Left the voice channel-").catch(e => { command_data.global_context.logger.api_error(e); });
    },
};