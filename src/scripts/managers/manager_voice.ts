import { Message, TextChannel } from "discord.js";
import { off } from "process";
import { GlobalContext } from "../../ts/types";
import VoiceRequest from "../helpers/voice_request";

class VoiceManager {

    connections: Map<any, any>;

    constructor() {
        this.connections = new Map();
    }

    add_connection(global_context: GlobalContext, id: string, voice_data: any) {
        global_context.neko_modules_clients.voiceManager.connections.set(id, voice_data);
        voice_data.connection.on("disconnect", () => {
            global_context.neko_modules_clients.voiceManager.on_disconnect(global_context, id);
        });
        voice_data.connection.on("error", () => {
            global_context.neko_modules_clients.voiceManager.on_error(global_context, id);
        });
    }

    on_error(global_context: GlobalContext, id: string) {
        global_context.neko_modules_clients.voiceManager.remove_connection(global_context, id);
    }

    on_disconnect(global_context: GlobalContext, id: string) {
        global_context.neko_modules_clients.voiceManager.remove_connection(global_context, id);
    }

    async remove_connection(global_context: GlobalContext, id: string, error_message: string | null) {
        if (global_context.neko_modules_clients.voiceManager.connections.has(id) === false) {
            return;
        }

        const voice_data = global_context.neko_modules_clients.voiceManager.connections.get(id);
        if (global_context.neko_modules_clients.voiceManager.connections.get(id).current !== -1) {
            if (isNaN(global_context.neko_modules_clients.voiceManager.connections.get(id).stream) === false) {
                global_context.neko_modules_clients.voiceManager.connections.get(id).stream.destroy();
            }

            if(error_message !== null) {
                const guild = await global_context.bot.guilds.fetch(id).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if(guild === null) { return; }
                const channel = await guild.channels.fetch(global_context.neko_modules_clients.voiceManager.connections.get(id).current.request_channel_ID).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if(channel === null || !(channel instanceof TextChannel)) { return; }
    
                channel.send(error_message).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }
        }

        voice_data.connection.channel.leave();
        global_context.neko_modules_clients.voiceManager.connections.delete(voice_data.id);
    }

    check_for_timeouts(global_context: GlobalContext) {
        global_context.neko_modules_clients.voiceManager.connections.forEach((voice_data: any) => {
            if (voice_data.connection.dispatcher == null) {
                global_context.neko_modules_clients.voiceManager.timeout_connection(global_context, voice_data.id);
            } else {
                if (voice_data.should_timeout === false && voice_data.connection.channel.members.size <= 1) {
                    voice_data.should_timeout = true;
                    setTimeout(global_context.neko_modules_clients.voiceManager.timeout_connection, voice_data.timeout_delay, global_context, voice_data.id);
                }

                if (voice_data.current !== -1 && voice_data.connection.dispatcher.paused === false) {
                    voice_data.elapsed_ms += 1000;
                }

                global_context.neko_modules_clients.voiceManager.connections.set(voice_data.id, voice_data);
            }
        });
    }

    async timeout_connection(global_context: GlobalContext, id: string) {
        if (global_context.neko_modules_clients.voiceManager.connections.has(id) === false) {
            return;
        }

        const voice_data = global_context.neko_modules_clients.voiceManager.connections.get(id);
        if (voice_data.connection.channel.members.size <= 1) {
            const guild = await global_context.bot.guilds.fetch(id).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            if (guild !== undefined) {
                const channel = await guild.channels.fetch(voice_data.init_message_channel_ID).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if(channel === null || !(channel instanceof TextChannel)) { return; }

                channel.send(`I left \`${voice_data.connection.channel.name}\`, because I was left alone.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
            }

            global_context.neko_modules_clients.voiceManager.remove_connection(global_context, id);
        } else {
            voice_data.should_timeout = false;
        }

        global_context.neko_modules_clients.voiceManager.connections.set(voice_data.id, voice_data);
    }

    async play_on_connection(global_context: GlobalContext, source_message: Message, loading_message: Message, info: any, log_type: any) {
        if(source_message.guild === null || source_message.member === null || global_context.bot.user === null) { return; }

        const id = source_message.guild.id;
        const voice_data = global_context.neko_modules_clients.voiceManager.connections.get(id);
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
        if (voice_data.current === -1) {
            stream = voice_data.connection.play(await global_context.modules.ytdl(info.url, { quality: "highestaudio", highWaterMark: 1 << 25 }), { type: "opus" });
            voice_data.elapsed_ms = 0;
            stream.on("finish", () => {
                voice_data.current = -1;
                if (voice_data.mode === 0) {
                    voice_data.persistent_queue.shift();
                }

                global_context.neko_modules_clients.voiceManager.play_next_on_connection(global_context, id);
            });
            stream.on("error", (err: Error) => {
                source_message.channel.send("There was an error while playing the video...").catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                global_context.logger.error(err);

                global_context.neko_modules_clients.voiceManager.remove_connection(global_context, id, err);
            });
        }

        const voice_request = new VoiceRequest();
        voice_request.url = info.url;
        voice_request.info = info;
        voice_request.request_message_ID = source_message.id;
        voice_request.request_channel_ID = source_message.channel.id;
        voice_request.request_user_ID = source_message.member.id;
        voice_request.stream = stream;

        if (voice_data.current === -1) {
            voice_data.current = voice_request;
            voice_data.persistent_queue = [voice_request];

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
            voice_data.queue.push(voice_request);
            voice_data.persistent_queue.push(voice_request);

            if (log_type >= 1) {
                embedPlay.author.name = `🔊 Added to queue - ${info.title}`;
                embedPlay.description = `Length: \`${current_length_2}\`\nLink: ${voice_request.url}\nAdded by: <@${voice_request.request_user_ID}>`;
                embedPlay.footer = { text: `Currently ${voice_data.queue.length} in queue` };

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
        global_context.neko_modules_clients.voiceManager.connections.set(id, voice_data);

        return voice_request;
    }

    async play_next_on_connection(global_context: GlobalContext, id: string) {
        if (global_context.neko_modules_clients.voiceManager.connections.has(id) === true) {
            const voice_data = global_context.neko_modules_clients.voiceManager.connections.get(id);
            if (voice_data.mode === 1 && voice_data.queue.length < 1) {
                voice_data.persistent_queue.forEach((voice_request: any) => {
                    voice_data.queue.push(voice_request);
                });
            }

            const embedPlay: any = {
                author: {
                    name: "-",
                },
                color: 8388736,
                description: "-",
            };

            if (voice_data.queue.length > 0) {
                const voice_request = voice_data.queue[0];
                const current_length = global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(voice_request.info.duration);
                let current_length_2 = global_context.neko_modules.timeConvert.convert_time_data_to_string(current_length);
                if (voice_request.info.duration === "P0D") {
                    current_length_2 = "Livestream";
                }

                const stream = voice_data.connection.play(await global_context.modules.ytdl(voice_request.url, { quality: "highestaudio", highWaterMark: 1 << 25 }), { type: "opus" });
                voice_data.elapsed_ms = 0;
                stream.on("finish", () => {
                    voice_data.current = -1;
                    if (voice_data.mode === 0) {
                        voice_data.persistent_queue.shift();
                    }

                    global_context.neko_modules_clients.voiceManager.play_next_on_connection(global_context, id);
                });
                stream.on("error", async (err: Error) => {
                    const channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch((e: Error) => {
                        global_context.logger.api_error(e);
                        return null;
                    });
                    if(channel === null || !(channel instanceof TextChannel)) { return; }

                    channel.send("There was an error while playing the video...").catch((e: Error) => {
                        global_context.logger.api_error(e);
                    });

                    global_context.logger.error(err);
                    global_context.neko_modules_clients.voiceManager.remove_connection(global_context, id, err);
                });

                voice_request.stream = stream;
                voice_data.current = voice_request;

                const channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch((e: Error) => {
                    global_context.logger.api_error(e);
                    return null;
                });
                if(channel === null || !(channel instanceof TextChannel)) { return; }

                embedPlay.author.name = `🔊 Playing - ${voice_request.info.title}`;
                embedPlay.description = `Length: \`${current_length_2}\`\nLink: ${voice_request.url}\nAdded by: <@${voice_request.request_user_ID}>`;
                embedPlay.footer = { text: `Currently ${voice_data.queue.length - 1} in queue` };

                channel.send({ embeds: [embedPlay] }).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });

                voice_data.queue.shift();
            }

            global_context.neko_modules_clients.voiceManager.connections.set(id, voice_data);
        }
    }

    play_url_on_connection(global_context: GlobalContext, source_message: Message, loading_message: Message, url: string, log_type: any) {
        let id;
        if (url.includes("youtube.com/watch?v=")) {
            const start = url.indexOf("youtube.com/watch?v=") + "youtube.com/watch?v=".length;
            id = url.substring(start, start + 11);
        } else if (url.includes("youtu.be/")) {
            const start = url.indexOf("youtu.be/") + "youtu.be/".length;
            id = url.substring(start, start + 11);
        }

        global_context.modules.ytinfo.retrieve(id, (err: Error, result: any) => {
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

            return global_context.neko_modules_clients.voiceManager.play_on_connection(global_context, source_message, loading_message, result_m, log_type);
        });
    }
}

export default VoiceManager;
