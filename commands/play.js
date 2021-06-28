const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "play",
    category: "Music",
    description: "Plays a song from url or searches it on youtube-",
    helpUsage: "[url/songName?]`",
    exampleUsage: "Never gonna give you up",
    hidden: false,
    aliases: ["p"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a valid url/song name-", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("me", "CONNECT"),
        new NeededPermission("me", "SPEAK")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        if(command_data.msg.member.voice.channel == null) {
            command_data.msg.reply("You need to join a voice channel-");
            return;
        }
        if(command_data.msg.member.voice.channel.joinable === false || command_data.msg.member.voice.channel.speakable === false) {
            command_data.msg.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again-");
            return;
        }

        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            let connection = await command_data.msg.member.voice.channel.join();
            let voiceData = new command_data.global_context.modules.VoiceData();
            voiceData0.id = command_data.msg.guild.id;
            voiceData0.connection = connection;
            voiceData0.joinedMessageChannelID = command_data.msg.channel.id;

            command_data.global_context.neko_modules_clients.vm.addConnection(data.bot, command_data.msg.guild.id, voiceData0);
            command_data.msg.channel.send(`Joined channel \`${command_data.msg.member.voice.channel.name}\`-`).catch(e => { console.log(e); });
        }

        if(command_data.args.length > 0) {
            let url = command_data.args[0];
            url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;

            if(data.bot.ytlist.validateID(url) === true) {
                const result = await data.bot.ytlist(url)
                .catch(e => {
                    console.error(e);
                    command_data.msg.channel.send("Failed to get video results-").catch(e => { console.log(e); });
                });
                if(result === undefined || result.items === undefined) { return; }

                for(let i = 0; i < result.items.length; i++) {
                    let item = result.items[i];
                    await command_data.global_context.neko_modules_clients.vm.playOnConnection(data.bot, data.msg, item.url, item, false);
                }

                command_data.msg.channel.send("Added `" + result.items.length + "` songs to the queue-").catch(e => { console.log(e); });
            } else if(data.bot.ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                command_data.global_context.neko_modules_clients.vm.playOnConnection(data.bot, data.msg, url);
            } else {
                var max = 5;
                const embedPlay = new command_data.global_context.modules.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle("Select a song to play (type 1-" + max + ")-")

                var infosByID = new Map();
                const result = await data.bot.ytsr(command_data.total_argument, { limit: 5 })
                .catch(e => {
                    command_data.msg.channel.send("Failed to get video results-").catch(e => { console.log(e); });
                    console.error(e);
                });
                if(result === undefined || result.items === undefined) { return; }
                result.items = result.items.filter(l => { return l.type === "video"; })
                result.items.sort(data.bot.sb.createComparatorViews());

                var descriptionText = "";
                for(let i = 1; i <= result.items.length; i++) {
                    let item = result.items[i];
                    if(item === undefined) {
                        descriptionText += "**" + i + ")** Private video?\n";
                    } else {
                        infosByID.set(i, item);

                        var currentLength1 = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(item.duration);
                        var currentLength2 = command_data.global_context.neko_modules_clients.tc.convertString_yt2(currentLength1);
                        descriptionText += "**" + i + ")** " + item.title + " *(" + currentLength2 + ")*\n";
                    }
                }

                var filter = m =>
                    (parseInt(m.content) <= 5 && parseInt(m.content) >= 1 && infosByID.has(parseInt(m.content))) || m.content.startsWith(command_data.server_config.prefix + "play");
                const collector = data.msg.channel.createMessageCollector(filter, { time: 15000, max: 1 });
                collector.on('collect', m => {
                    if(m.content.startsWith(command_data.server_config.prefix + "play") === true) {
                        collector.stop();
                        return;
                    }

                    const pos = parseInt(m.content);
                    command_data.global_context.neko_modules_clients.vm.playOnConnection(data.bot, m, infosByID.get(pos).url, infosByID.get(pos));
                });

                embedPlay.setDescription(descriptionText);
                command_data.msg.channel.send("", { embed: embedPlay }).catch(e => { console.log(e); });
            }
        }
    },
};