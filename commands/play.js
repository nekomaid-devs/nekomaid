const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "play",
    category: "Music",
    description: "Plays a song from url or searches it on youtube.",
    helpUsage: "[url/songName?]`",
    exampleUsage: "Never gonna give you up",
    hidden: false,
    aliases: ["p"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a valid url/song name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("me", "CONNECT"),
        new NeededPermission("me", "SPEAK")
    ],
    nsfw: false,
    async execute(command_data) {
        if(command_data.msg.member.voice.channel == null) {
            command_data.msg.reply("You need to join a voice channel.");
            return;
        }
        if(command_data.msg.member.voice.channel.joinable === false || command_data.msg.member.voice.channel.speakable === false) {
            command_data.msg.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again.");
            return;
        }

        let avatar_url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        if(command_data.global_context.neko_modules_clients.vm.connections.has(command_data.msg.guild.id) === false) {
            let connection = await command_data.msg.member.voice.channel.join();
            let voice_data = new command_data.global_context.neko_modules.VoiceData();
            voice_data.id = command_data.msg.guild.id;
            voice_data.connection = connection;
            voice_data.init_message_channel_ID = command_data.msg.channel.id;

            command_data.global_context.neko_modules_clients.vm.add_connection(command_data.global_context, command_data.msg.guild.id, voice_data);

            let embedJoin = {
                author: {
                    name: `Joined channel - ${command_data.msg.member.voice.channel.name}`,
                    icon_url: avatar_url,
                },
                color: 8388736,
                description: `Joined \`${command_data.msg.member.voice.channel.name}\` in \`${command_data.msg.guild.name}\``
            }

            command_data.msg.channel.send("", { embed: embedJoin }).catch(e => { command_data.global_context.logger.api_error(e); });
        }

        if(command_data.args.length > 0) {
            let url = command_data.args[0];
            url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;

            let embedPlay = {
                author: {
                    name: "Loading...",
                    icon_url: avatar_url,
                },
                color: 8388736,
                description: `Fetching results for \`${url}\``
            }
            let message = await command_data.msg.channel.send("", { embed: embedPlay }).catch(e => { command_data.global_context.logger.api_error(e); });

            if(command_data.global_context.modules.ytlist.validateID(url) === true) {
                let result = await command_data.global_context.modules.ytlist(url)
                .catch(err => {
                    command_data.global_context.logger.error(err);
                    command_data.msg.channel.send("Failed to get video results...").catch(e => { command_data.global_context.logger.api_error(e); });
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

                embedPlay.author.name = `Added \`${result.items.length}\` songs to the queue!`;
                embedPlay.description = "Done~ <:n_music:771823629570277396>";
                message.edit("", { embed: embedPlay }).catch(e => { command_data.global_context.logger.api_error(e); });
            } else if(command_data.global_context.modules.ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                command_data.global_context.neko_modules_clients.vm.play_on_connection(command_data.global_context, command_data.msg, url);
            } else {
                let max = 5;
                let infosByID = new Map();
                let result = await command_data.global_context.modules.ytsr(command_data.total_argument, { limit: 5 })
                .catch(err => {
                    command_data.global_context.logger.error(err);
                    command_data.msg.channel.send("Failed to get video results...").catch(e => { command_data.global_context.logger.api_error(e); });
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

                        let current_length = command_data.global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(item.duration);
                        let current_length_1 = command_data.global_context.neko_modules_clients.tc.convert_time_data_to_string(current_length);
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

                embedPlay.author.name = `Select a song to play (type 1-${max}) <:n_music:771823629570277396>`;
                embedPlay.description = description_text;
                message.edit("", { embed: embedPlay }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        }
    },
};