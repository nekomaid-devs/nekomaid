const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'play',
    category: 'Music',
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
    async execute(data) {
        if(data.authorMember.voice.channel == null) {
            data.reply("You need to join a voice channel-");
            return;
        }

        if(data.authorMember.voice.channel.joinable === false || data.authorMember.voice.channel.speakable === false) {
            data.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again-");
            return;
        }

        if(data.bot.vm.connections.has(data.guild.id) === false) {
            var connection = await data.authorMember.voice.channel.join();
            var voiceData0 = new data.bot.VoiceData();
            voiceData0.id = data.guild.id;
            voiceData0.connection = connection;
            voiceData0.joinedMessageChannelID = data.channel.id;

            data.bot.vm.addConnection(data.bot, data.guild.id, voiceData0);
            data.channel.send("Joined channel `" + data.authorMember.voice.channel.name + "`-").catch(e => { console.log(e); });
        }

        if(data.args.length > 0) {
            let url = data.args[0];
            url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;

            if(data.bot.ytlist.validateID(url) === true) {
                const result = await data.bot.ytlist(url)
                .catch(e => {
                    console.error(e);
                    data.channel.send("Failed to get video results-").catch(e => { console.log(e); });
                });
                if(result === undefined || result.items === undefined) { return; }

                for(let i = 0; i < result.items.length; i++) {
                    let item = result.items[i];
                    await data.bot.vm.playOnConnection(data.bot, data.msg, item.url, item, false);
                }

                data.channel.send("Added `" + result.items.length + "` songs to the queue-").catch(e => { console.log(e); });
            } else if(data.bot.ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                data.bot.vm.playOnConnection(data.bot, data.msg, url);
            } else {
                var max = 5;
                const embedPlay = new data.bot.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle("Select a song to play (type 1-" + max + ")-")

                var infosByID = new Map();
                const result = await data.bot.ytsr(data.totalArgument, { limit: 5 })
                .catch(e => {
                    data.channel.send("Failed to get video results-").catch(e => { console.log(e); });
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

                        var currentLength1 = data.bot.tc.decideConvertString_yt(item.duration);
                        var currentLength2 = data.bot.tc.convertString_yt2(currentLength1);
                        descriptionText += "**" + i + ")** " + item.title + " *(" + currentLength2 + ")*\n";
                    }
                }

                var filter = m =>
                    (parseInt(m.content) <= 5 && parseInt(m.content) >= 1 && infosByID.has(parseInt(m.content))) || m.content.startsWith(data.serverConfig.prefix + "play");
                const collector = data.msg.channel.createMessageCollector(filter, { time: 15000, max: 1 });
                collector.on('collect', m => {
                    if(m.content.startsWith(data.serverConfig.prefix + "play") === true) {
                        collector.stop();
                        return;
                    }

                    const pos = parseInt(m.content);
                    data.bot.vm.playOnConnection(data.bot, m, infosByID.get(pos).url, infosByID.get(pos));
                });

                embedPlay.setDescription(descriptionText);
                data.channel.send("", { embed: embedPlay }).catch(e => { console.log(e); });
            }
        }
    },
};