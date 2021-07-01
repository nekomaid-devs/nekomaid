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
        // TODO: add a loading embed
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
            let voice_data = new command_data.global_context.neko_modules.VoiceData();
            voice_data.id = command_data.msg.guild.id;
            voice_data.connection = connection;
            voice_data.joinedMessageChannelID = command_data.msg.channel.id;

            command_data.global_context.neko_modules_clients.vm.add_connection(command_data.global_context, command_data.msg.guild.id, voice_data);
            command_data.msg.channel.send(`Joined channel \`${command_data.msg.member.voice.channel.name}\`-`).catch(e => { console.log(e); });
        }

        if(command_data.args.length > 0) {
            let url = command_data.args[0];
            url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;

            if(command_data.global_context.modules.ytlist.validateID(url) === true) {
                let result = await command_data.global_context.modules.ytlist(url)
                .catch(e => {
                    console.error(e);
                    command_data.msg.channel.send("Failed to get video results-").catch(e => { console.log(e); });
                });
                if(result === undefined || result.items === undefined) { return; }

                for(let i = 0; i < result.items.length; i++) {
                    let item = {
                        title: result.items[i].title,
                        url: result.items[i].url,
                        duration: result.items[i].duration
                    }
                    await command_data.global_context.neko_modules_clients.vm.play_on_connection(command_data.global_context, command_data.msg, item.url, item, false);
                }

                command_data.msg.channel.send(`Added \`${result.items.length}\` songs to the queue-`).catch(e => { console.log(e); });
            } else if(command_data.global_context.modules.ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                command_data.global_context.neko_modules_clients.vm.play_on_connection(command_data.global_context, command_data.msg, url);
            } else {
                let max = 5;
                let embedPlay = new command_data.global_context.modules.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle(`Select a song to play (type 1-${max})-`)

                let infosByID = new Map();
                let result = await command_data.global_context.modules.ytsr(command_data.total_argument, { limit: 5 })
                .catch(e => {
                    command_data.msg.channel.send("Failed to get video results-").catch(e => { console.log(e); });
                    console.error(e);
                });
                if(result === undefined || result.items === undefined) { return; }
                result.items = result.items.filter(l => { return l.type === "video"; })
                result.items.sort(command_data.global_context.neko_modules_clients.sb.create_comparator(["views"]));

                let description_text = "";
                for(let i = 1; i <= result.items.length; i++) {
                    if(result.items[i] === undefined) {
                        description_text += `**${i})** Private video?\n`;
                    } else {
                        let item = {
                            title: result.items[i].title,
                            url: result.items[i].url,
                            duration: result.items[i].duration
                        }
                        infosByID.set(i, item);

                        let current_length = command_data.global_context.neko_modules_clients.tc.decideConvertString_yt(item.duration);
                        let current_length_1 = command_data.global_context.neko_modules_clients.tc.convertString_yt2(current_length);
                        description_text += `**${i})** ${item.title} *(${current_length_1})*\n`;
                    }
                }

                let filter = m =>
                    (parseInt(m.content) <= 5 && parseInt(m.content) >= 1 && infosByID.has(parseInt(m.content))) || m.content.startsWith(command_data.server_config.prefix + "play");
                let collector = command_data.msg.channel.createMessageCollector(filter, { time: 15000, max: 1 });
                collector.on('collect', m => {
                    if(m.content.startsWith(`${command_data.server_config.prefix}play`) === true) {
                        collector.stop();
                        return;
                    }

                    let pos = parseInt(m.content);
                    command_data.global_context.neko_modules_clients.vm.play_on_connection(command_data.global_context, m, infosByID.get(pos).url, infosByID.get(pos));
                });

                embedPlay.setDescription(description_text);
                command_data.msg.channel.send("", { embed: embedPlay }).catch(e => { console.log(e); });
            }
        }
    },
};