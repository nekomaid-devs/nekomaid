/* Types */
import { GlobalContext } from "../../ts/base";
import { VoiceConnectionData, VoiceRequestData } from "../../ts/voice";
import { Message, TextChannel, VoiceChannel } from "discord.js-light";

/* Node Imports */
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import ytdl from "ytdl-core";
import { randomBytes } from "crypto";

/* Local Imports */
import { ms_to_string_yt } from "../utils/time";

class VoiceManager {
    connections: Map<string, VoiceConnectionData>;

    constructor() {
        this.connections = new Map();
    }

    add_connection(global_context: GlobalContext, channel: VoiceChannel, message: Message) {
        if (message.guild === null || message.member === null || message.member.voice.channel === null) {
            return null;
        }

        const voice_connection = {
            id: message.guild.id,
            voice_channel_ID: channel.id,
            channel_ID: message.channel.id,

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
        voice_connection.connection.on("error", (e) => {
            if (message.guild === null) {
                return;
            }
            this.remove_connection(global_context, message.guild.id, e.toString());
        });
        voice_connection.player.on("stateChange", (oldState, newState) => {
            if (message.guild === null) {
                return;
            }
            if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                voice_connection.current = null;
                if (voice_connection.mode === 0) {
                    voice_connection.persistent_queue.shift();
                }

                if (voice_connection.mode === 1 && voice_connection.queue.length < 1) {
                    voice_connection.persistent_queue.forEach((voice_request) => {
                        voice_connection.queue.push(voice_request);
                    });
                }

                const item = voice_connection.queue.shift();
                if (item !== undefined) {
                    this.play_request_on_connection(global_context, voice_connection, item, false);
                }
            }
        });
        voice_connection.player.on("error", (e) => {
            if (message.guild === null) {
                return;
            }
            this.remove_connection(global_context, message.guild.id, e.toString());
        });

        const embedJoin = {
            author: {
                name: `🔊 Joined channel - ${message.member.voice.channel.name}`,
            },
            color: 8388736,
            description: `Joined \`${message.member.voice.channel.name}\` in \`${message.member.guild.name}\``,
        };
        message.channel.send({ embeds: [embedJoin] }).catch((e: Error) => {
            global_context.logger.api_error(e);
        });

        this.connections.set(message.guild.id, voice_connection);
        return voice_connection;
    }

    async remove_connection(global_context: GlobalContext, id: string, error_message: string | null) {
        const voice_connection = this.connections.get(id);
        if (voice_connection === undefined) {
            return;
        }
        if (error_message !== null) {
            global_context.logger.error(error_message);

            const channel = await global_context.bot.channels.fetch(voice_connection.voice_channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof TextChannel)) {
                return;
            }
            channel.send(error_message).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        }

        voice_connection.player.stop();
        voice_connection.connection.disconnect();

        this.connections.delete(voice_connection.id);
    }

    tick_connections(global_context: GlobalContext) {
        this.connections.forEach(async (voice_connection) => {
            const channel = await global_context.bot.channels.fetch(voice_connection.voice_channel_ID).catch((e: Error) => {
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
                const channel_i = await global_context.bot.channels.fetch(voice_connection.channel_ID).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if (channel_i === null || !(channel_i instanceof TextChannel)) {
                    return;
                }

                channel_i.send(`I left \`${channel.name}\`, because I was left alone.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                this.remove_connection(global_context, channel_i.guild.id, null);
                return;
            }

            this.connections.set(voice_connection.id, voice_connection);
        });
    }

    async play_request_on_connection(global_context: GlobalContext, voice_connection: VoiceConnectionData, request: VoiceRequestData, log: boolean) {
        const channel = await global_context.bot.channels.fetch(voice_connection.channel_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
            return null;
        });
        if (channel === null || !(channel instanceof TextChannel)) {
            return;
        }

        if (request.item.duration >= 1000 * 60 * 60 * 3) {
            /*
             * const user_data = await global_context.neko_modules_clients.db.fetch_global_user(source_message.member.id, false, false);
             * if (user_data === null) {
             *  return;
             * }
             * const end = new Date();
             * const start = new Date(user_data.last_upvoted_time);
             * let diff = (end.getTime() - start.getTime()) / 1000;
             * diff /= 60;
             * diff = Math.abs(Math.round(diff));
             *
             * if (diff >= 3600) {
             *  const embedError = {
             *      author: {
             *          name: "🔊 Long videos",
             *      },
             *      color: 8388736,
             *      description: `To play videos longer than \`3h\`, please upvote the bot on [here](https://top.gg/bot/${global_context.bot.user.id}/vote).`,
             *  };
             *
             *  await source_message.channel.send({ embeds: [embedError] }).catch((e: Error) => {
             *      global_context.logger.api_error(e);
             *  });
             *  return;
             * }
             */
        }

        if (voice_connection.current === null) {
            const resource = createAudioResource(await ytdl(request.item.url, { quality: "highestaudio", highWaterMark: 1 << 25 }));
            voice_connection.player.play(resource);

            voice_connection.elapsed_ms = 0;
            voice_connection.current = request;
            voice_connection.persistent_queue = [request];

            if (log) {
                const embedPlay = {
                    author: {
                        name: `🔊 Playing - ${request.item.title}`,
                    },
                    color: 8388736,
                    description: `Length: \`${ms_to_string_yt(request.item.duration)}\`\nLink: ${request.item.url}\nAdded by: <@${request.user_ID}>`,
                    footer: {
                        text: `Currently ${voice_connection.queue.length} in queue`,
                    },
                };
                await channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
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
                    description: `Length: \`${ms_to_string_yt(request.item.duration)}\`\nLink: ${request.item.url}\nAdded by: <@${request.user_ID}>`,
                    footer: {
                        text: `Currently ${voice_connection.queue.length} in queue`,
                    },
                };
                await channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }
    }

    play_url_on_connection(global_context: GlobalContext, voice_connection: VoiceConnectionData, user_ID: string, url: string, log: boolean) {
        global_context.modules.ytinfo.retrieve(ytdl.getVideoID(url), (e: Error | null, raw_item: string) => {
            if (e) {
                global_context.logger.error(e as Error);
                return;
            }
            raw_item = JSON.stringify(raw_item);

            const a = raw_item.indexOf("lengthSeconds") + "lengthSeconds".length + '\\":\\"'.length;
            const duration = parseInt(raw_item.substring(a, raw_item.indexOf("\\", a)));
            const b = raw_item.indexOf("title") + "title".length + '\\":\\"'.length;
            let title = raw_item.substring(b, raw_item.indexOf("\\", b));
            title = title.split("+").join(" ");

            const request = {
                id: randomBytes(16).toString("hex"),
                item: {
                    url: url,
                    title: title,
                    duration: duration * 1000,
                },
                user_ID: user_ID,
            };

            return this.play_request_on_connection(global_context, voice_connection, request, log);
        });
    }
}

export default VoiceManager;
