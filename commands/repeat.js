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
        // TODO: re-factor command
        if(data.bot.vm.connections.has(command_data.msg.guild.id) === false || data.bot.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing playing-");
            return;
        }

        var voiceData = data.bot.vm.connections.get(command_data.msg.guild.id);
        voiceData.mode = voiceData.mode === 0 ? 1 : 0;

        if(voiceData.mode === 1) {
            command_data.msg.channel.send("Repeating current queue-").catch(e => { console.log(e); });
            console.log("- [voice] Set mode to 1 in VoiceConnection(id: " + command_data.msg.guild.id + ")");
        } else {
            command_data.msg.channel.send("Stopped repeating current queue-").catch(e => { console.log(e); });
            console.log("- [voice] Set mode to 0 in VoiceConnection(id: " + command_data.msg.guild.id + ")");
        }
    },
};