/* Types */
import { GlobalContext } from "../../ts/base";
import { VoiceConnectionData } from "../../ts/voice";
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
        if(message.guild === null) { return; }

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
    
            should_timeout: false,
            timeout_delay: 30000,
            elapsed_ms: 0
        };

        voice_connection.connection.on(VoiceConnectionStatus.Disconnected, () => {
            if(message.guild === null) { return; }
            this.remove_connection(global_context, message.guild.id, null);
        });
        voice_connection.connection.on("error", () => {
            if(message.guild === null) { return; }
            this.remove_connection(global_context, message.guild.id, null);
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
            const channel = await global_context.bot.channels.fetch(voice_connection.init_message_channel_ID).catch((e: Error) => {
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

        if (voice_connection.current !== null && voice_connection.current.stream !== null) {
            voice_connection.current.stream.destroy();
        }
        voice_connection.connection.disconnect();

        this.connections.delete(voice_connection.id);
    }

    check_for_timeouts(global_context: GlobalContext) {
        this.connections.forEach(async(voice_connection) => {
            if (voice_connection.player === null) {
                this.timeout_connection(global_context, voice_connection.id);
                return;
            }

            const channel = await global_context.bot.channels.fetch(voice_connection.init_message_channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof VoiceChannel)) {
                return;
            }

            if (voice_connection.should_timeout === false && channel.members.size <= 1) {
                voice_connection.should_timeout = true;
                setTimeout(this.timeout_connection, voice_connection.timeout_delay, global_context, voice_connection.id);
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

    async play_on_connection(global_context: GlobalContext, source_message: Message, loading_message: Message, info: any, log_type: any) {
        if (source_message.guild === null || source_message.member === null || global_context.bot.user === null) {
            return;
        }
        const voice_connection = this.connections.get(source_message.guild.id);
        if(voice_connection === undefined) { return; }

        const embedPlay: any = {
            author: {
                name: "-",
            },
            color: 8388736,
            description: "-",
        };

        const user_config = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "global_user", id: source_message.member.id });
        const end = new Date();
        const start = new Date(user_config.last_upvoted_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        const current_length = global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(info.duration);
        if (current_length.status !== -1 && (current_length.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
            embedPlay.author.name = "🔊 Long videos";
            embedPlay.description = `To play videos longer than \`3h\`, please upvote the bot on [here](https://top.gg/bot/${global_context.bot.user.id}/vote).`;

            await loading_message.delete().catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            await source_message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            return;
        }
        let current_length_2 = global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length);
        if (info.duration === "P0D") {
            current_length_2 = "Livestream";
        }

        let stream;
        if (voice_connection.current === null) {
            const resource = createAudioResource(await ytdl(info.url, { quality: "highestaudio", highWaterMark: 1 << 25 }));
            stream = voice_connection.player.play(resource);
            voice_connection.elapsed_ms = 0;

            /*stream.on("finish", () => {
                if (source_message.guild === null) { return; }
                voice_connection.current = null;
                if (voice_connection.mode === 0) {
                    voice_connection.persistent_queue.shift();
                }

                this.play_next_on_connection(global_context, source_message.guild.id);
            });
            stream.on("error", (err: Error) => {
                if (source_message.guild === null) { return; }
                source_message.channel.send("There was an error while playing the video...").catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                global_context.logger.error(err);

                this.remove_connection(global_context, source_message.guild.id, err.toString());
            });*/
        }

        const voice_request = {
            url: info.url,
            info: info,
            request_message_ID: source_message.id,
            request_channel_ID: source_message.channel.id,
            request_user_ID:source_message.member.id,
            stream: stream
        };

        if (voice_connection.current === null) {
            voice_connection.current = voice_request;
            voice_connection.persistent_queue = [voice_request];

            if (log_type >= 1) {
                embedPlay.author.name = `🔊 Playing - ${info.title}`;
                embedPlay.description = `Length: \`${current_length_2}\`\nLink: ${voice_request.url}\nAdded by: <@${voice_request.request_user_ID}>`;
                embedPlay.footer = { text: `Currently 0 in queue` };

                if (log_type >= 2) {
                    await loading_message.delete().catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
                await source_message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        } else {
            voice_connection.queue.push(voice_request);
            voice_connection.persistent_queue.push(voice_request);

            if (log_type >= 1) {
                embedPlay.author.name = `🔊 Added to queue - ${info.title}`;
                embedPlay.description = `Length: \`${current_length_2}\`\nLink: ${voice_request.url}\nAdded by: <@${voice_request.request_user_ID}>`;
                embedPlay.footer = { text: `Currently ${voice_connection.queue.length} in queue` };

                if (log_type >= 2) {
                    await loading_message.delete().catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });
                }
                await source_message.channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        return voice_request;
    }

    async play_next_on_connection(global_context: GlobalContext, guild_ID: string) {
        const voice_connection = this.connections.get(guild_ID);
        if (voice_connection === undefined) { return; }

        if (voice_connection.mode === 1 && voice_connection.queue.length < 1) {
            voice_connection.persistent_queue.forEach((voice_request) => {
                voice_connection.queue.push(voice_request);
            });
        }

        const embedPlay: any = {
            author: {
                name: "-",
            },
            color: 8388736,
            description: "-",
        };

        if (voice_connection.queue.length > 0) {
            const voice_request = voice_connection.queue[0];
            const current_length = global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(voice_request.info.duration);
            let current_length_2 = global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length);
            if (voice_request.info.duration === "P0D") {
                current_length_2 = "Livestream";
            }

            const resource = createAudioResource(await ytdl(voice_request.info.url, { quality: "highestaudio", highWaterMark: 1 << 25 }));
            const stream = voice_connection.player.play(resource);
            voice_connection.elapsed_ms = 0;

            /*stream.on("finish", () => {
                voice_connection.current = null;
                if (voice_connection.mode === 0) {
                    voice_connection.persistent_queue.shift();
                }

                this.play_next_on_connection(global_context, guild_ID);
            });
            stream.on("error", async (e: Error) => {
                const channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch((err: Error) => {
                    global_context.logger.api_error(err);
                    return null;
                });
                if (channel === null || !(channel instanceof TextChannel)) {
                    return;
                }

                channel.send("There was an error while playing the video...").catch((e: Error) => {
                    global_context.logger.api_error(e);
                });

                global_context.logger.error(e);
                this.remove_connection(global_context, guild_ID, e.toString());
            });*/

            voice_request.stream = stream;
            voice_connection.current = voice_request;

            const channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof TextChannel)) {
                return;
            }

            embedPlay.author.name = `🔊 Playing - ${voice_request.info.title}`;
            embedPlay.description = `Length: \`${current_length_2}\`\nLink: ${voice_request.url}\nAdded by: <@${voice_request.request_user_ID}>`;
            embedPlay.footer = { text: `Currently ${voice_connection.queue.length - 1} in queue` };

            channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                global_context.logger.api_error(e);
            });

            voice_connection.queue.shift();
        }
    }

    play_url_on_connection(global_context: GlobalContext, source_message: Message, loading_message: Message, url: string, log: any) {
        const id = ytdl.getVideoID(url);
        global_context.modules.ytinfo.retrieve(id, (err: Error | null, result: string) => {
            if (err) {
                global_context.logger.error(err);
                return;
            }
            result = JSON.stringify(result);

            const a = result.indexOf("lengthSeconds") + "lengthSeconds".length + '\\":\\"'.length;
            const duration = parseInt(result.substring(a, result.indexOf("\\", a)));
            const b = result.indexOf("title") + "title".length + '\\":\\"'.length;
            const title = result.substring(b, result.indexOf("\\", b));
            const result_m = {
                title: title.split("+").join(" "),
                url: url,
                duration: global_context.neko_modules.timeConvert.convert_time_data_to_string(global_context.neko_modules.timeConvert.convert_string_to_time_data(global_context.neko_modules.timeConvert.convert_time(duration * 1000))),
            };

            return this.play_on_connection(global_context, source_message, loading_message, result_m, log);
        });
    }
}

export default VoiceManager;
