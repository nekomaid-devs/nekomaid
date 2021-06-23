module.exports = {
    name: 'leave',
    category: 'Music',
    description: "Leaves the voice channel-",
    helpUsage: "`",
    hidden: false,
    aliases: ["stop"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        if(data.bot.vm.connections.has(data.guild.id) === false) {
            data.reply("I'm not in a voice channel-");
            return;
        }

        data.bot.vm.removeConnection(data.bot, data.guild.id);
        data.channel.send("Left the voice channel-").catch(e => { console.log(e); });
    },
};