/* Types */
import { GlobalContext } from "../../ts/base";
import { VoiceConnectionData, VoiceRequestData } from "../../ts/voice";
import { Message, TextChannel, VoiceChannel } from "discord.js";

/* Node Imports */
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import ytdl from "ytdl-core";

class VoiceManager {
    connections: Map<string, VoiceConnectionData>;

    constructor() {
        this.connections = new Map();
    }

    add_connection(global_context: GlobalContext, channel: VoiceChannel, message: Message) {
        if (message.guild === null) {
            return;
        }

        const voice_connection = {
            id: message.guild.id,
            init_message_channel_ID: message.guild.id,
            channel_ID: channel.id,

            connection: joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator }),
            player: createAudioPlayer(),

            mode: 0,
            current: null,
            queue: [],
            persistent_queue: [],

            elapsed_ms: 0,
            timeout_elapsed_ms: 0,
        };

        voice_connection.connection.on(VoiceConnectionStatus.Disconnected, () => {
            if (message.guild === null) {
                return;
            }
            this.remove_connection(global_context, message.guild.id, null);
        });
        voice_connection.connection.on("error", () => {
            if (message.guild === null) {
                return;
            }
            this.remove_connection(global_context, message.guild.id, null);
        });

        this.connections.set(message.guild.id, voice_connection);
        return voice_connection;
    }

    async remove_connection(global_context: GlobalContext, guild_ID: string, error_message: string | null) {
        const voice_connection = this.connections.get(guild_ID);
        if (voice_connection === undefined) {
            return;
        }
        const channel = await global_context.bot.channels.fetch(voice_connection.init_message_channel_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (channel === null || !(channel instanceof TextChannel)) {
            return;
        }

        if (error_message !== null) {
            channel.send(error_message).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }

        if (voice_connection.current !== null && voice_connection.current.stream !== null) {
            voice_connection.current.stream.destroy();
        }
        voice_connection.connection.disconnect();

        this.connections.delete(voice_connection.id);
    }

    tick_connections(global_context: GlobalContext) {
        this.connections.forEach(async (voice_connection) => {
            const channel = await global_context.bot.channels.fetch(voice_connection.init_message_channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof VoiceChannel)) {
                return;
            }

            if (channel.members.size <= 1) {
                voice_connection.timeout_elapsed_ms += 1000;
            } else {
                voice_connection.timeout_elapsed_ms = 0;
            }
            if (voice_connection.timeout_elapsed_ms > 30000) {
                this.timeout_connection(global_context, voice_connection.id);
                return;
            }
            if (voice_connection.current !== null && voice_connection.player.state.status === AudioPlayerStatus.Paused) {
                voice_connection.elapsed_ms += 1000;
            }

            this.connections.set(voice_connection.id, voice_connection);
        });
    }

    async timeout_connection(global_context: GlobalContext, guild_ID: string) {
        const voice_connection = this.connections.get(guild_ID);
        if (voice_connection === undefined) {
            return;
        }
        const channel = await global_context.bot.channels.fetch(voice_connection.channel_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (channel === null || !(channel instanceof TextChannel)) {
            return;
        }

        channel.send(`I left \`${channel.name}\`, because I was left alone.`).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        this.remove_connection(global_context, guild_ID, null);
    }

    async play_request_on_connection(global_context: GlobalContext, request: VoiceRequestData, source_message: Message, log: boolean) {
        if (source_message.guild === null || source_message.member === null || global_context.bot.user === null) {
            return;
        }
        const voice_connection = this.connections.get(source_message.guild.id);
        if (voice_connection === undefined) {
            return;
        }

        const current_length = global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(request.item.duration);
        if (current_length.status !== -1 && current_length.hrs >= 3) {
            const user_config = await global_context.neko_modules_clients.db.fetch_global_user(source_message.member.id, false, false);
            if (user_config === null) {
                return;
            }
            const end = new Date();
            const start = new Date(user_config.last_upvoted_time);
            let diff = (end.getTime() - start.getTime()) / 1000;
            diff /= 60;
            diff = Math.abs(Math.round(diff));

            if (diff >= 3600) {
                const embedError = {
                    author: {
                        name: "🔊 Long videos",
                    },
                    color: 8388736,
                    description: `To play videos longer than \`3h\`, please upvote the bot on [here](https://top.gg/bot/${global_context.bot.user.id}/vote).`,
                };

                await source_message.channel.send({ embeds: [ embedError ] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                return;
            }
        }

        if (voice_connection.current === null) {
            const resource = createAudioResource(await ytdl(request.item.url, { quality: "highestaudio", highWaterMark: 1 << 25 }));
            request.stream = voice_connection.player.play(resource);

            /*
             *stream.on("finish", () => {
             *  if (source_message.guild === null) { return; }
             *  voice_connection.current = null;
             *  if (voice_connection.mode === 0) {
             *      voice_connection.persistent_queue.shift();
             *  }
             *
             *  this.play_next_on_connection(global_context, source_message.guild.id);
             *});
             *stream.on("error", (err: Error) => {
             *  if (source_message.guild === null) { return; }
             *  source_message.channel.send("There was an error while playing the video...").catch((e: Error) => {
             *      global_context.logger.api_error(e);
             *  });
             *  global_context.logger.error(err);
             *
             *  this.remove_connection(global_context, source_message.guild.id, err.toString());
             *});
             */

            voice_connection.elapsed_ms = 0;
            voice_connection.current = request;
            voice_connection.persistent_queue = [ request ];

            if (log) {
                const embedPlay = {
                    author: {
                        name: `🔊 Playing - ${request.item.title}`,
                    },
                    color: 8388736,
                    description: `Length: \`${global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length)}\`\nLink: ${request.item.url}\nAdded by: <@${request.request_user_ID}>`,
                    footer: {
                        text: `Currently ${voice_connection.queue.length} in queue`,
                    },
                };
                await source_message.channel.send({ embeds: [ embedPlay ] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        } else {
            voice_connection.queue.push(request);
            voice_connection.persistent_queue.push(request);

            if (log) {
                const embedPlay = {
                    author: {
                        name: `🔊 Added to queue - ${request.item.title}`,
                    },
                    color: 8388736,
                    description: `Length: \`${global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length)}\`\nLink: ${request.item.url}\nAdded by: <@${request.request_user_ID}>`,
                    footer: {
                        text: `Currently ${voice_connection.queue.length} in queue`,
                    },
                };
                await source_message.channel.send({ embeds: [ embedPlay ] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }
    }

    play_next_on_connection(global_context: GlobalContext, source_message: Message) {
        if (source_message.guild === null) {
            return;
        }
        const voice_connection = this.connections.get(source_message.guild.id);
        if (voice_connection === undefined) {
            return;
        }

        if (voice_connection.mode === 1 && voice_connection.queue.length < 1) {
            voice_connection.persistent_queue.forEach((voice_request) => {
                voice_connection.queue.push(voice_request);
            });
        }

        const item = voice_connection.queue.shift();
        if (item !== undefined) {
            this.play_request_on_connection(global_context, item, source_message, false);
        }
    }

    play_url_on_connection(global_context: GlobalContext, url: string, source_message: Message, log: boolean) {
        global_context.modules.ytinfo.retrieve(ytdl.getVideoID(url), (e: Error | null, raw_item: string) => {
            if (e) {
                global_context.logger.error(e);
                return;
            }
            raw_item = JSON.stringify(raw_item);

            const a = raw_item.indexOf("lengthSeconds") + "lengthSeconds".length + "\\\":\\\"".length;
            const duration = parseInt(raw_item.substring(a, raw_item.indexOf("\\", a)));
            const b = raw_item.indexOf("title") + "title".length + "\\\":\\\"".length;
            let title = raw_item.substring(b, raw_item.indexOf("\\", b));
            title = title.split("+").join(" ");

            const request = {
                item: {
                    url: url,
                    title: title,
                    duration: global_context.neko_modules.timeConvert.convert_time_data_to_string(global_context.neko_modules.timeConvert.convert_string_to_time_data(global_context.neko_modules.timeConvert.convert_time(duration * 1000))),
                },
                stream: null,
                request_message_ID: source_message.id,
                request_channel_ID: source_message.channel.id,
                request_user_ID: source_message.author.id,
            };

            return this.play_request_on_connection(global_context, request, source_message, log);
        });
    }
}

export default VoiceManager;
