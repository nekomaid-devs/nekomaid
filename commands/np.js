module.exports = {
    name: "np",
    category: "Music",
    description: "Displays the current playing song-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        if(data.bot.vm.connections.has(command_data.msg.guild.id) === false || data.bot.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing on the queue-");
            return;
        }

        var voiceData = data.bot.vm.connections.get(command_data.msg.guild.id);

        const embedNP = new data.bot.Discord.MessageEmbed();
        embedNP
        .setColor(8388736)
        .setTitle('Current playing for `' + command_data.msg.guild.name + '`')
        .setFooter(`Nekomaid`);

        var currentLength0b = data.bot.tc.convertString_yt2(data.bot.tc.decideConvertString_yt(voiceData.current.info.duration));
        var user = await data.bot.users.fetch(voiceData.current.requestUserID).catch(e => { console.log(e); });
        if(user !== undefined) {
            var descriptionText = "[" + voiceData.current.info.title + "](" + voiceData.current.info.link + ") *(" + currentLength0b + ")*\n";

            var totalLength = data.bot.tc.decideConvertString_yt(voiceData.current.info.duration);
            var elapsedLength = data.bot.tc.convertString(data.bot.tc.convertTime(voiceData.elapsedMilis));
            totalLength = data.bot.tc.substractTimes(totalLength, elapsedLength);
            totalLength = data.bot.tc.convertTime_inconsistent(totalLength);
            totalLength = data.bot.tc.convertString_yt2(totalLength);

            embedNP.addField("Title", descriptionText);
            embedNP.addField("Requested by", "`" + user.username + "#" + user.discriminator + "`");
            embedNP.addField("Remaining", "`" + totalLength + "`");
            command_data.msg.channel.send("", { embed: embedNP }).catch(e => { console.log(e); });
        }
    },
};