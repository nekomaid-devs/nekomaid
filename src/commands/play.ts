/* Types */
import { CommandData, Command } from "../ts/base";
import { VoiceConnectionData } from "../ts/voice";
import { Message, Permissions, VoiceChannel } from "discord.js-light";

/* Node Imports */
import ytpl, { validateID } from "ytpl";
import ytsr from "ytsr";
import ytdl from "ytdl-core";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import Argument from "../scripts/helpers/argument";
import { create_comparator } from "../scripts/utils/sort";

export default {
    name: "play",
    category: "Music",
    description: "Plays a song from url or searches it on youtube.",
    helpUsage: "[url/songName?]`",
    exampleUsage: "Never gonna give you up",
    hidden: false,
    aliases: ["p"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a valid url/song name.", "none", true)],
    permissions: [new Permission("me", Permissions.FLAGS.CONNECT), new Permission("me", Permissions.FLAGS.SPEAK)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.message.member === null) {
            return;
        }
        if (command_data.message.member.voice.channel === null || !(command_data.message.member.voice.channel instanceof VoiceChannel)) {
            command_data.message.reply("You need to join a voice channel.");
            return;
        }
        if (command_data.message.member.voice.channel.joinable === false || command_data.message.member.voice.channel.speakable === false) {
            command_data.message.reply("The bot doesn't have required permissions in this channel - `Connect`, `Speak`\nPlease add required permissions for the bot in this channel and try again.");
            return;
        }

        let voice_connection: VoiceConnectionData | undefined | null = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.message.guild.id);
        if (voice_connection === undefined) {
            voice_connection = command_data.global_context.neko_modules_clients.voiceManager.add_connection(command_data.global_context, command_data.message.member.voice.channel, command_data.message);
        }
        if (voice_connection === null) {
            return;
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
            const loading_message = await command_data.message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (loading_message === null) {
                return;
            }

            if (validateID(url) === true) {
                const result = await ytpl(url).catch((e) => {
                    command_data.message.channel.send("Failed to get video results...").catch((err) => {
                        command_data.global_context.logger.api_error(err);
                    });
                    command_data.global_context.logger.error(e);
                });
                if (result === undefined || result.items === undefined) {
                    return;
                }

                for (let i = 0; i < result.items.length; i++) {
                    await command_data.global_context.neko_modules_clients.voiceManager.play_url_on_connection(command_data.global_context, voice_connection, command_data.message.author.id, result.items[i].url, false);
                }

                embedPlay.author.name = `🔊 Added ${result.items.length} songs to the queue!`;
                embedPlay.description = undefined;
                embedPlay.footer = { text: `Currently ${voice_connection.queue.length} in queue` };

                await loading_message.delete().catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                await command_data.message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            } else if (ytdl.validateURL(url) === true) {
                url = url.startsWith("<") === true ? url.substring(1, url.length - 1) : url;
                command_data.global_context.neko_modules_clients.voiceManager.play_url_on_connection(command_data.global_context, voice_connection, command_data.message.author.id, url, true);
            } else {
                const max = 5;
                const urls: string[] = [];
                const result = await ytsr(command_data.total_argument, { limit: 5 }).catch((e: Error) => {
                    command_data.global_context.logger.error(e as Error);
                    command_data.message.channel.send("Failed to get video results...").catch((e: Error) => {
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
                    const item = result.items[i];
                    if (item.type !== "video" || item.duration === null) {
                        continue;
                    }
                    urls.push(item.url);

                    description_text += `**${i})** ${item.title} *(${item.duration})*\n`;
                }

                const collector = command_data.message.channel.createMessageCollector({
                    filter: (m: Message) => {
                        return (parseInt(m.content) <= 5 && parseInt(m.content) >= 1 && urls.length >= parseInt(m.content)) || m.content.startsWith(`${command_data.guild_data.prefix}play`);
                    },
                    time: 15000,
                    max: 1,
                });
                collector.on("collect", (m) => {
                    if (voice_connection === null || voice_connection === undefined || m.content.startsWith(`${command_data.guild_data.prefix}play`) === true) {
                        collector.stop();
                        return;
                    }

                    const pos = parseInt(m.content);
                    command_data.global_context.neko_modules_clients.voiceManager.play_url_on_connection(command_data.global_context, voice_connection, m.author.id, urls[pos], true);
                });

                embedPlay.author.name = `🔊 Select a song to play (type 1-${max})`;
                embedPlay.description = description_text;

                await loading_message.delete().catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                await command_data.message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }
        }
    },
} as Command;
