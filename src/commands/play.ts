/* Types */
import { CommandData, Command } from "../ts/base";
import { Message, Permissions, VoiceChannel } from "discord.js";

/* Node Imports */
import ytpl, { validateID } from "ytpl";
import ytsr from "ytsr";
import ytdl from "ytdl-core";

/* Local Imports */
import NeededPermission from "../scripts/helpers/needed_permission";
import NeededArgument from "../scripts/helpers/needed_argument";
import { create_comparator } from "../scripts/utils/util_sort_by";

export default {
    name: "play",
    category: "Music",
    description: "Plays a song from url or searches it on youtube.",
    helpUsage: "[url/songName?]`",
    exampleUsage: "Never gonna give you up",
    hidden: false,
    aliases: ["p"],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in a valid url/song name.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("me", Permissions.FLAGS.CONNECT), new NeededPermission("me", Permissions.FLAGS.SPEAK)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.msg.member === null) {
            return;
        }
        if (command_data.msg.member.voice.channel === null || !(command_data.msg.member.voice.channel instanceof VoiceChannel)) {
            command_data.msg.reply("You need to join a voice channel.");
            return;
        }
        if (command_data.msg.member.voice.channel.joinable === false || command_data.msg.member.voice.channel.speakable === false) {
            command_data.msg.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again.");
            return;
        }

        if (command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false) {
            const voice_connection = command_data.global_context.neko_modules_clients.voiceManager.add_connection(command_data.global_context, command_data.msg.member.voice.channel, command_data.msg);

            const embedJoin = {
                author: {
                    name: `🔊 Joined channel - ${command_data.msg.member.voice.channel.name}`,
                },
                color: 8388736,
                description: `Joined \`${command_data.msg.member.voice.channel.name}\` in \`${command_data.msg.guild.name}\``,
            };

            command_data.msg.channel.send({ embeds: [embedJoin] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }

        if (command_data.args.length > 0) {
            let url = command_data.total_argument;
            url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;

            const embedPlay: any = {
                author: {
                    name: "🔊 Loading...",
                },
                color: 8388736,
                description: `Fetching results for \`${url}\``,
            };
            const loading_message = await command_data.msg.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (loading_message === null) {
                return;
            }

            if (validateID(url) === true) {
                const result = await ytpl(url).catch((err: Error) => {
                    command_data.global_context.logger.error(err);
                    command_data.msg.channel.send("Failed to get video results...").catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                });
                if (result === undefined || result.items === undefined) {
                    return;
                }

                for (let i = 0; i < result.items.length; i++) {
                    if (result.items[i] !== undefined) {
                        const item = {
                            title: result.items[i].title,
                            url: result.items[i].url,
                            duration: result.items[i].duration,
                        };

                        await command_data.global_context.neko_modules_clients.voiceManager.play_on_connection(command_data.global_context, command_data.msg, loading_message, item, 0);
                    }
                }

                const voice_data = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
                embedPlay.author.name = `🔊 Added ${result.items.length} songs to the queue!`;
                embedPlay.description = undefined;
                embedPlay.footer = { text: `Currently ${voice_data.queue.length} in queue` };

                await loading_message.delete().catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                await command_data.msg.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else if (ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                command_data.global_context.neko_modules_clients.voiceManager.play_url_on_connection(command_data.global_context, command_data.msg, loading_message, url, 2);
            } else {
                const max = 5;
                const infosByID = new Map();
                const result = await ytsr(command_data.total_argument, { limit: 5 }).catch((e: Error) => {
                    command_data.global_context.logger.error(e);
                    command_data.msg.channel.send("Failed to get video results...").catch((e: Error) => {
                        command_data.global_context.logger.api_error(e);
                    });
                    return null;
                });
                if (result === null) {
                    return;
                }
                result.items.sort(create_comparator(["views"]));

                let description_text = "";
                for (let i = 1; i <= result.items.length; i++) {
                    const videoItem = result.items[i];
                    if (videoItem.type !== "video") {
                        continue;
                    }
                    const item = {
                        title: videoItem.title,
                        url: videoItem.url,
                        duration: videoItem.duration,
                    };
                    infosByID.set(i, item);

                    const current_length = command_data.global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(item.duration);
                    const current_length_1 = command_data.global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length);
                    description_text += `**${i})** ${item.title} *(${current_length_1})*\n`;
                }

                const collector = command_data.msg.channel.createMessageCollector({
                    filter: (m: Message) => {
                        return (parseInt(m.content) <= 5 && parseInt(m.content) >= 1 && infosByID.has(parseInt(m.content))) || m.content.startsWith(command_data.server_config.prefix + "play");
                    },
                    time: 15000,
                    max: 1,
                });
                collector.on("collect", (m) => {
                    if (m.content.startsWith(`${command_data.server_config.prefix}play`) === true) {
                        collector.stop();
                        return;
                    }

                    const pos = parseInt(m.content);
                    command_data.global_context.neko_modules_clients.voiceManager.play_on_connection(command_data.global_context, command_data.msg, loading_message, infosByID.get(pos), 1);
                });

                embedPlay.author.name = `🔊 Select a song to play (type 1-${max})`;
                embedPlay.description = description_text;

                await loading_message.delete().catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                await command_data.msg.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
    },
} as Command;