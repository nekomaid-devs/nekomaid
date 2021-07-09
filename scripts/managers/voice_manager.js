class VoiceManager {
    constructor() {
        this.connections = new Map();
    }

    add_connection(global_context, id, voice_data) {
        global_context.neko_modules_clients.vm.connections.set(id, voice_data);
        voice_data.connection.on("disconnect", () => {
            global_context.neko_modules_clients.vm.on_disconnect(global_context, id)
        });
        voice_data.connection.on("error", () => {
            global_context.neko_modules_clients.vm.on_error(global_context, id)
        });
    }

    on_error(global_context, id) {
        global_context.neko_modules_clients.vm.remove_connection(global_context, id);
    }

    on_disconnect(global_context, id) {
        global_context.neko_modules_clients.vm.remove_connection(global_context, id);
    }

    async remove_connection(global_context, id, message = -1) {
        if(global_context.neko_modules_clients.vm.connections.has(id) === false) {
            return;
        }

        if(global_context.neko_modules_clients.vm.connections.get(id).current != -1) {
            if(isNaN(global_context.neko_modules_clients.vm.connections.get(id).stream) === false) {
                global_context.neko_modules_clients.vm.connections.get(id).stream.destroy();
            }

            if(message !== -1) {
                let guild = await global_context.bot.guilds.fetch(id).catch(e => { global_context.logger.api_error(e); });
                let channel = await guild.channels.fetch(global_context.neko_modules_clients.vm.connections.get(id).current.request_channel_ID).catch(e => { global_context.logger.api_error(e); });
                channel.send(message).catch(e => { global_context.logger.api_error(e) });
            }
        }

        global_context.neko_modules_clients.vm.connections.get(id).connection.channel.leave();
        global_context.neko_modules_clients.vm.connections.delete(id);
    }

    check_for_timeouts(global_context) {
        global_context.neko_modules_clients.vm.connections.forEach(voice_data => {
            if(voice_data.connection.dispatcher == null) {
                global_context.neko_modules_clients.vm.timeout_connection(global_context, voice_data.id);
            } else {
                if(voice_data.should_timeout === false && voice_data.connection.channel.members.size < 2) {
                    global_context.neko_modules_clients.vm.connections.get(voice_data.id).should_timeout = true;
                    setTimeout(global_context.neko_modules_clients.vm.timeout_connection, voice_data.timeout_delay, global_context, voice_data.id);
                }
    
                if(voice_data.current != -1 && voice_data.connection.dispatcher.paused === false) {
                    voice_data.elapsed_ms += 1000;
                }
            }
        });
    }

    async timeout_connection(global_context, id) {
        if(global_context.neko_modules_clients.vm.connections.has(id) === false) {
            return;
        }

        let voice_data = global_context.neko_modules_clients.vm.connections.get(id);
        if(voice_data.connection.channel.members.size < 2) {
            let guild = await global_context.bot.guilds.fetch(id).catch(e => { global_context.logger.api_error(e); });
            let channel = await guild.channels.fetch(voice_data.init_message_channel_ID).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                channel.send(`I left \`${voice_data.connection.channel.name}\`, because I was left alone.`).catch(e => { global_context.logger.api_error(e); });
            }

            global_context.neko_modules_clients.vm.remove_connection(global_context, id);
        } else {
            global_context.neko_modules_clients.vm.connections.get(id).should_timeout = false;
        }
    }

    async play_on_connection(global_context, msg, url, info = 0, log_added = true) {
        let id = msg.guild.id;
        let voice_data = global_context.neko_modules_clients.vm.connections.get(id);

        let user_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: msg.member.id });  
        let end = new Date();
        let start = new Date(user_config.last_upvoted_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));
        
        // TODO: this part needs to be redone
        if(voice_data.current === -1) {
            switch(info) {
                case 0:
                    return global_context.neko_modules_clients.vm.get_url_info_and_play(global_context, msg, url, log_added);

                case -2:
                    msg.channel.send(`Failed to get video info(url: \`${url}\`)...`).catch(e => { global_context.logger.api_error(e); });
                    break;

                default: {
                    let current_length = global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(info.duration);
                    if(current_length.status != -1 && (current_length.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
                        msg.channel.send(`To play videos longer than \`3h\` please upvote the bot on here ˇˇ\nhttps://top.gg/bot/${global_context.bot.user.id}/vote`).catch(e => { global_context.logger.api_error(e); });
                        return;
                    }
                    let current_length_2 = global_context.neko_modules_clients.tc.convert_time_data_to_string(current_length);
                    if(info.duration === "P0D") {
                        current_length_2 = "Livestream";
                    }
                    
                    let stream = voice_data.connection.play(await global_context.modules.ytdl(url, { quality: 'highestaudio', highWaterMark: 1 << 25 }), { type: 'opus' });
                    voice_data.elapsed_ms = 0;
                    stream.on("finish", () => {
                        voice_data.current = -1;
                        if(voice_data.mode === 0) {
                            voice_data.persistent_queue.shift();
                        }

                        global_context.neko_modules_clients.vm.try_playing_next(global_context, id);
                    });
                    stream.on("error", err => {
                        msg.channel.send("There was an error while playing the video...").catch(e => { global_context.logger.api_error(e); });
                        global_context.logger.error(err);
                        
                        global_context.neko_modules_clients.vm.remove_connection(global_context, id, err);
                    });

                    let voice_request = new global_context.neko_modules.VoiceRequest();
                    voice_request.url = url;
                    voice_request.info = info;
                    voice_request.request_message_ID = msg.id;
                    voice_request.uuid = global_context.modules.crypto.randomBytes(16).toString("hex");
                    voice_request.request_channel_ID = msg.channel.id;
                    voice_request.request_user_ID = msg.member.id;
                    voice_request.stream = stream;

                    voice_data = global_context.neko_modules_clients.vm.connections.get(id);
                    voice_data.current = voice_request;
                    voice_data.persistent_queue = [ voice_request ]
                    global_context.neko_modules_clients.vm.connections.set(id, voice_data);

                    msg.channel.send(`Playing \`${info.title}\` *(${current_length_2})*-`).catch(e => { global_context.logger.api_error(e); });
                    return voice_request;
                }
            }
        } else {
            switch(info) {
                case 0:
                    global_context.neko_modules_clients.vm.get_url_info_and_play(global_context, msg, url, log_added);
                    break;

                case -2:
                    msg.channel.send(`Failed to get video info (url: \`${url}\`)...`).catch(e => { global_context.logger.api_error(e); });
                    break;

                default: {
                    let current_length = global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(info.duration);
                    if(current_length.status != -1 && (current_length.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
                        msg.channel.send(`To play videos longer than \`3h\` please upvote the bot on here ˇˇ\nhttps://top.gg/bot/${global_context.bot.user.id}/vote`).catch(e => { global_context.logger.api_error(e); });
                        return;
                    }
                    let current_length_2 = global_context.neko_modules_clients.tc.convert_time_data_to_string(current_length);
                    if(info.duration === "P0D") {
                        current_length_2 = "Livestream";
                    }

                    let voice_request = new global_context.neko_modules.VoiceRequest();
                    voice_request.url = url;
                    voice_request.info = info;
                    voice_request.request_message_ID = msg.id;
                    voice_request.uuid = global_context.modules.crypto.randomBytes(16).toString("hex");
                    voice_request.request_channel_ID = msg.channel.id;
                    voice_request.request_user_ID = msg.member.id;

                    voice_data.queue.push(voice_request);
                    voice_data.persistent_queue.push(voice_request);
                    global_context.neko_modules_clients.vm.connections.set(id, voice_data);

                    let length = voice_data.queue.length;
                    if(log_added === true) {
                        msg.channel.send(`Added \`${info.title}\` *(${current_length_2})* to the queue (\`${length}\` in the queue)...`).catch(e => { global_context.logger.api_error(e); });
                    }
                    return voice_request;
                }
            }
        }
    }

    async try_playing_next(global_context, id) {
        if(global_context.neko_modules_clients.vm.connections.has(id) === true) {
            let voice_data = global_context.neko_modules_clients.vm.connections.get(id);
            if(voice_data.mode === 1 && voice_data.queue.length < 1) {
                voice_data.persistent_queue.forEach(voice_request => {
                    voice_data.queue.push(voice_request)
                });
            }

            if(voice_data.queue.length > 0) {
                let voice_request = voice_data.queue[0];
                let current_length = global_context.neko_modules_clients.tc.convert_youtube_string_to_time_data(voice_request.info.duration);
                let current_length_2 = global_context.neko_modules_clients.tc.convert_time_data_to_string(current_length);
                if(voice_request.info.duration === "P0D") {
                    current_length_2 = "Livestream";
                }

                let stream = voice_data.connection.play(await global_context.modules.ytdl(voice_request.url, { quality: 'highestaudio', highWaterMark: 1 << 25 }), { type: 'opus' });
                voice_data.elapsed_ms = 0;
                stream.on("finish", () => {
                    voice_data.current = -1;
                    if(voice_data.mode === 0) {
                        voice_data.persistent_queue.shift();
                    }

                    global_context.neko_modules_clients.vm.try_playing_next(global_context, id);
                });
        
                stream.on("error", async(err) => {
                    let channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch(e => { global_context.logger.api_error(e); });
                    channel.send("There was an error while playing the video...").catch(e => { global_context.logger.api_error(e); });
                    global_context.logger.error(err);

                    global_context.neko_modules_clients.vm.remove_connection(global_context, id, err);
                });

                voice_request.stream = stream;
                voice_data.current = voice_request;

                let channel = await global_context.bot.channels.fetch(voice_request.request_channel_ID).catch(e => { global_context.logger.api_error(e); });
                let length = voice_data.queue.length - 1;
                if(channel !== undefined) {
                    channel.send(`Playing \`${voice_request.info.title}\` *(${current_length_2})* (\`${length}\` in the queue)...`).catch(e => { global_context.logger.api_error(e); });
                }

                voice_data.queue.shift();
            }

            global_context.neko_modules_clients.vm.connections.set(id, voice_data);
        }
    }

    // TODO: this needs to be a promise
    async get_url_info_and_play(global_context, msg, url, log_added) {
        let info = -1;
        let id = -1;
        if(url.includes("youtube.com/watch?v=")) {
            let start = url.indexOf("youtube.com/watch?v=") + "youtube.com/watch?v=".length;
            id = url.substring(start, (start + 11));
        } else if(url.includes("youtu.be/")) {
            let start = url.indexOf("youtu.be/") + "youtu.be/".length;
            id = url.substring(start, (start + 11));
        }

        global_context.modules.ytinfo.retrieve(id, (err, result) => {
            if (err) {
                global_context.logger.error(err);
                return;
            }
            result = JSON.stringify(result);

            let a = result.indexOf("lengthSeconds") + "lengthSeconds".length + '\\":\\"'.length;
            let duration = parseInt(result.substring(a, result.indexOf('\\', a)));
            let b = result.indexOf("title") + "title".length + '\\":\\"'.length;
            let title = result.substring(b, result.indexOf('\\', b));
            let result_m = {
                title: title.split("+").join(" "),
                url: url,
                duration: global_context.neko_modules_clients.tc.convert_time_data_to_string(global_context.neko_modules_clients.tc.convert_string_to_time_data(global_context.neko_modules_clients.tc.convert_time(duration * 1000)))
            }

            return global_context.neko_modules_clients.vm.play_on_connection(global_context, msg, url, result_m, log_added);
        });
    }
}

module.exports = VoiceManager;