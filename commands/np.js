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
        // TODO: add buttons to skip song, etc.
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false || command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id).current === -1) {
            command_data.msg.reply("There's nothing on the queue-");
            return;
        }

        let voice_data = command_data.global_context.neko_modules_clients.vm.connections.get(command_data.msg.guild.id);
        let embedNP = new command_data.global_context.modules.Discord.MessageEmbed();
        embedNP
        .setColor(8388736)
        .setTitle(`Current playing for \`${command_data.msg.guild.name}\``)
        .setFooter("Nekomaid");

        let currentLength0b = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.current.info.duration));
        let user = await command_data.global_context.bot.users.fetch(voice_data.current.requestUserID).catch(e => { console.log(e); });
        if(user !== undefined) {
            let descriptionText = `[${voice_data.current.info.title}](${voice_data.current.info.url}) *(${currentLength0b})*\n`;

            let totalLength = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_data.current.info.duration);
            let elapsedLength = command_data.global_context.neko_modules_clients.tc.convert_string_to_time_data(command_data.global_context.neko_modules_clients.tc.convert_time(voice_data.elapsedMilis));
            totalLength = command_data.global_context.neko_modules_clients.tc.sub_times(totalLength, elapsedLength);
            totalLength = command_data.global_context.neko_modules_clients.tc.convert_time_inconsistent(totalLength);
            totalLength = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(totalLength);

            embedNP.addField("Title", descriptionText);
            embedNP.addField("Requested by", `\`${user.tag}\``);
            embedNP.addField("Remaining", `\`${totalLength}\``);
            command_data.msg.channel.send("", { embed: embedNP }).catch(e => { console.log(e); });
        }
    },
};