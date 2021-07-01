class VoiceManager {
    constructor(global_context) {
        this.global_context = global_context;
        this.connections = new Map();
        
        setInterval(this.check_for_timeouts, 1000, global_context);
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
                let guild = await global_context.bot.guilds.fetch(id).catch(e => { console.log(e); });
                let channel = await guild.channels.fetch(global_context.neko_modules_clients.vm.connections.get(id).current.requestChannelID).catch(e => { console.log(e); });
                channel.send(message).catch(e => { console.log(e) }).catch(e => { console.log(e); });
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
                if(voice_data.timeouting === false && voice_data.connection.channel.members.size < 2) {
                    global_context.neko_modules_clients.vm.connections.get(voice_data.id).timeouting = true;
                    setTimeout(global_context.neko_modules_clients.vm.timeout_connection, voice_data.timeoutDelay, global_context, voice_data.id);
                }
    
                if(voice_data.current != -1 && voice_data.connection.dispatcher.paused === false) {
                    voice_data.elapsedMilis += 1000;
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
            let guild = await global_context.bot.guilds.fetch(id).catch(e => { console.log(e); });
            let channel = await guild.channels.fetch(voice_data.joinedMessageChannelID).catch(e => { console.log(e); });
            if(channel !== undefined) {
                channel.send(`I left \`${voice_data.connection.channel.name}\`, because I was left alone-`).catch(e => { console.log(e); });
            }

            global_context.neko_modules_clients.vm.remove_connection(global_context, id);
        } else {
            global_context.neko_modules_clients.vm.connections.get(id).timeouting = false;
        }
    }

    async play_on_connection(global_context, msg, url, info = 0, log_added = true) {
        let id = msg.guild.id;
        let voice_data = global_context.neko_modules_clients.vm.connections.get(id);

        let user_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "globalUser", id: msg.member.id });  
        let end = new Date();
        let start = new Date(user_config.lastUpvotedTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));
        
        if(voice_data.current === -1) {
            switch(info) {
                case 0:
                    global_context.neko_modules_clients.vm.get_url_info_and_play(global_context, msg, url, log_added);
                    break;

                case -2:
                    msg.channel.send(`Failed to get video info(url: \`${url}\`)-`).catch(e => { console.log(e); });
                    break;

                default: {
                    let current_length = global_context.neko_modules_clients.tc.decideConvertString_yt(info.duration);
                    if(current_length.status != -1 && (current_length.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
                        msg.channel.send(`To play videos longer than \`3h\` please upvote the bot on here ˇˇ\nhttps://top.gg/bot/${global_context.bot.user.id}/vote`).catch(e => { console.log(e); });
                        return;
                    }
                    let current_length_2 = global_context.neko_modules_clients.tc.convertString_yt2(current_length);
                    if(info.duration === "P0D") {
                        current_length_2 = "Livestream";
                    }
                    
                    let stream = voice_data.connection.play(await global_context.modules.ytdl(url, { quality: 'highestaudio', highWaterMark: 1 << 25 }), { type: 'opus' });
                    voice_data.elapsedMilis = 0;
                    stream.on("finish", () => {
                        voice_data.current = -1;
                        if(voice_data.mode === 0) {
                            voice_data.persistentQueue.shift();
                        }

                        try {
                            global_context.neko_modules_clients.vm.try_playing_next(global_context, id);
                        } catch(error) {
                            console.error(error);
                        }
                    });
                    stream.on("error", error => {
                        msg.channel.send("There was an error while playing the video-").catch(e => { console.log(e); });
                        console.error(error);
                        global_context.neko_modules_clients.vm.remove_connection(global_context, id, error);
                    });

                    let voice_request = new global_context.neko_modules.VoiceRequest();
                    voice_request.url = url;
                    voice_request.info = info;
                    voice_request.requestMessageID = msg.id;
                    voice_request.uuid = global_context.modules.crypto.randomBytes(16).toString("hex");
                    voice_request.requestChannelID = msg.channel.id;
                    voice_request.requestUserID = msg.member.id;
                    voice_request.stream = stream;

                    voice_data = global_context.neko_modules_clients.vm.connections.get(id);
                    voice_data.current = voice_request;
                    voice_data.persistentQueue = [ voice_request ]
                    global_context.neko_modules_clients.vm.connections.set(id, voice_data);

                    msg.channel.send(`Playing \`${info.title}\` *(${current_length_2})*-`).catch(e => { console.log(e); });
                    break;
                }
            }
        } else {
            switch(info) {
                case 0:
                    global_context.neko_modules_clients.vm.get_url_info_and_play(global_context, msg, url, log_added);
                    break;

                case -2:
                    msg.channel.send(`Failed to get video info(url: \`${url}\`)-`).catch(e => { console.log(e); });
                    break;

                default: {
                    let current_length = global_context.neko_modules_clients.tc.decideConvertString_yt(info.duration);
                    if(current_length.status != -1 && (current_length.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
                        msg.channel.send(`To play videos longer than \`3h\` please upvote the bot on here ˇˇ\nhttps://top.gg/bot/${global_context.bot.user.id}/vote`).catch(e => { console.log(e); });
                        return;
                    }
                    let current_length_2 = global_context.neko_modules_clients.tc.convertString_yt2(current_length);
                    if(info.duration === "P0D") {
                        current_length_2 = "Livestream";
                    }

                    let voice_request = new global_context.neko_modules.VoiceRequest();
                    voice_request.url = url;
                    voice_request.info = info;
                    voice_request.requestMessageID = msg.id;
                    voice_request.uuid = global_context.modules.crypto.randomBytes(16).toString("hex");
                    voice_request.requestChannelID = msg.channel.id;
                    voice_request.requestUserID = msg.member.id;
                    voice_data.queue.push(voice_request);
                    voice_data.persistentQueue.push(voice_request);
                    global_context.neko_modules_clients.vm.connections.set(id, voice_data);

                    let length = voice_data.queue.length;
                    if(log_added === true) {
                        msg.channel.send(`Added \`${info.title}\` *(${current_length_2})* to the queue (\`${length}\` in the queue)-`).catch(e => { console.log(e); });
                    }
                    break;
                }
            }
        }
    }

    async try_playing_next(global_context, id) {
        if(global_context.neko_modules_clients.vm.connections.has(id) === true) {
            let voice_data = global_context.neko_modules_clients.vm.connections.get(id);
            if(voice_data.mode === 1 && voice_data.queue.length < 1) {
                voice_data.persistentQueue.forEach(voice_request => {
                    voice_data.queue.push(voice_request)
                });
            }

            if(voice_data.queue.length > 0) {
                let voice_request = voice_data.queue[0];
                let current_length = global_context.neko_modules_clients.tc.decideConvertString_yt(voice_request.info.duration);
                let current_length_2 = global_context.neko_modules_clients.tc.convertString_yt2(current_length);
                if(voice_request.info.duration === "P0D") {
                    current_length_2 = "Livestream";
                }

                let stream = voice_data.connection.play(await global_context.modules.ytdl(voice_request.url, { quality: 'highestaudio', highWaterMark: 1 << 25 }), { type: 'opus' });
                voice_data.elapsedMilis = 0;
                stream.on("finish", () => {
                    voice_data.current = -1;
                    if(voice_data.mode === 0) {
                        voice_data.persistentQueue.shift();
                    }

                    try {
                        global_context.neko_modules_clients.vm.try_playing_next(global_context, id);
                    } catch(error) {
                        console.error(error);
                    }
                });
        
                stream.on("error", async(error) => {
                    let channel = await global_context.bot.channels.fetch(voice_request.requestChannelID).catch(e => { console.log(e); });
                    channel.send("There was an error while playing the video-").catch(e => { console.log(e); });
                    console.error(error);
                    global_context.neko_modules_clients.vm.remove_connection(global_context, id, error);
                });

                voice_request.stream = stream;
                voice_data.current = voice_request;

                let channel = await global_context.bot.channels.fetch(voice_request.requestChannelID).catch(e => { console.log(e); });
                let length = voice_data.queue.length - 1;
                if(channel !== undefined) {
                    channel.send(`Playing \`${voice_request.info.title}\` *(${current_length_2})* (\`${length}\` in the queue)-`).catch(e => { console.log(e); });
                }

                voice_data.queue.shift();
            }

            global_context.neko_modules_clients.vm.connections.set(id, voice_data);
        }
    }

    get_url_info_and_play(global_context, msg, url, log_added) {
        let info = -1;
        let id = -1;
        if(url.includes("youtube.com/watch?v=")) {
            let start = url.indexOf("youtube.com/watch?v=") + "youtube.com/watch?v=".length;
            id = url.substring(start, (start + 11));
        } else if(url.includes("youtu.be/")) {
            let start = url.indexOf("youtu.be/") + "youtu.be/".length;
            id = url.substring(start, (start + 11));
        }

        global_context.modules.ytinfo.retrieve(id, (error, result) => {
            if (error) {
                console.error(error);
                return;
            }
            result = JSON.stringify(result);

            let a = result.indexOf("lengthSeconds") + "lengthSeconds".length + '\\":\\"'.length;
            let duration = parseInt(result.substring(a, result.indexOf('\\', a)));
            let b = result.indexOf("title") + "title".length + '\\":\\"'.length;
            let title = result.substring(b, result.indexOf('\\', b));
            var result_m = {
                title: title.split("+").join(" "),
                url: url,
                duration: global_context.neko_modules_clients.tc.convertString_yt2(global_context.neko_modules_clients.tc.convertString(global_context.neko_modules_clients.tc.convertTime(duration * 1000)))
            }

            if (error || result_m === undefined) {
                global_context.neko_modules_clients.vm.play_on_connection(global_context, msg, url, -2, log_added);
            } else {
                global_context.neko_modules_clients.vm.play_on_connection(global_context, msg, url, result_m, log_added);
            }
        });
    }
}

module.exports = VoiceManager;