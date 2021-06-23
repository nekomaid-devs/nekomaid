class VoiceManager {
    constructor(bot) {
        this.connections = new Map();
        setInterval(this.checkForTimeouts, 1000, bot);
    }

    addConnection(bot, id, voiceData) {
        bot.vm.connections.set(id, voiceData);
        voiceData.connection.on("disconnect", () => {
            bot.vm.onDisconnect(bot, id)
        });
        voiceData.connection.on("error", () => {
            bot.vm.onError(bot, id)
        });

        console.log("- [voice] Created VoiceConnection for Guild(id: " + id + ")");
    }

    onError(bot, id) {
        bot.vm.removeConnection(bot, id);
    }

    onDisconnect(bot, id) {
        bot.vm.removeConnection(bot, id);
    }

    async removeConnection(bot, id, message = -1) {
        if(bot.vm.connections.has(id) === false) {
            return;
        }

        if(bot.vm.connections.get(id).current != -1) {
            if(isNaN(bot.vm.connections.get(id).stream) === false) {
                bot.vm.connections.get(id).stream.destroy();
            }

            if(message !== -1) {
                var guild = await bot.guilds.fetch(id).catch(e => { console.log(e); });
                var channel = await guild.channels.fetch(bot.vm.connections.get(id).current.requestChannelID).catch(e => { console.log(e); });
                channel.send(message).catch(e => { console.log(e) }).catch(e => { console.log(e); });
            }
        }

        bot.vm.connections.get(id).connection.channel.leave();
        bot.vm.connections.delete(id);

        console.log("- [voice] Removed VoiceConnection from Guild(id: " + id + ")");
    }

    checkForTimeouts(bot) {
        bot.vm.connections.forEach(voiceData => {
            if(voiceData.connection.dispatcher == null) {
                bot.vm.timeoutConnection(bot, voiceData.id);
            } else {
                if(voiceData.timeouting === false && voiceData.connection.channel.members.size < 2) {
                    bot.vm.connections.get(voiceData.id).timeouting = true;
                    setTimeout(bot.vm.timeoutConnection, voiceData.timeoutDelay, bot, voiceData.id);
                }
    
                if(voiceData.current != -1 && voiceData.connection.dispatcher.paused === false) {
                    voiceData.elapsedMilis += 1000;
                }
            }
        });
    }

    async timeoutConnection(bot, id) {
        if(bot.vm.connections.has(id) === false) {
            return;
        }

        var voiceData = bot.vm.connections.get(id);
        if(voiceData.connection.channel.members.size < 2) {
            var guild = await bot.guilds.fetch(id).catch(e => { console.log(e); });
            var channel = await guild.channels.fetch(voiceData.joinedMessageChannelID).catch(e => { console.log(e); });
            if(channel !== undefined) {
                channel.send("I left `" + voiceData.connection.channel.name + "`, because I was left alone-").catch(e => { console.log(e); });
            }
            
            console.log("- [voice] VoiceConnection from Guild(id: " + id + ") timeouted");
            bot.vm.removeConnection(bot, id);
        } else {
            bot.vm.connections.get(id).timeouting = false;
        }
    }

    async playOnConnection(bot, msg, url, info = 0, logAdded = true) {
        var id = msg.guild.id;
        var voiceData = bot.vm.connections.get(id);

        //Get user config
        var userConfig = await bot.ssm.server_fetch.fetch(bot, { type: "globalUser", id: msg.member.id });  

        //Get premium state
        var end = new Date();
        var start = new Date(userConfig.lastUpvotedTime);

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        if(voiceData.current === -1) {
            switch(info) {
                case 0:
                    bot.vm.getUrlInfoAndPlay(bot, msg, url, logAdded);
                    break;

                case -2:
                    msg.channel.send("Failed to get video info(url: `" + url + "`)-").catch(e => { console.log(e); });
                    break;

                default: {
                    const currentLength = bot.tc.decideConvertString_yt(info.duration);
                    /*if(currentLength.status != -1 && (currentLength.hrs >= 3 || info.duration === "P0D") && diff > 3600) {
                        msg.channel.send("To play videos longer than `3h` please upvote the bot on here ˇˇ\nhttps://top.gg/bot/691398095841263678/vote").catch(e => { console.log(e); });
                        return;
                    }*/
                    
                    var stream = voiceData.connection.play(await bot.ytdl(url, { quality: 'highestaudio' }).catch(e => { console.log(e); }), { type: 'opus', highWaterMark: 50 });
                    voiceData.elapsedMilis = 0;
                    stream.on("finish", () => {
                        voiceData.current = -1;
                        if(voiceData.mode === 0) {
                            voiceData.persistentQueue.shift();
                        }

                        try {
                            bot.vm.tryPlayingNext(bot, id);
                        } catch(error) {
                            console.error(error);
                        }
                    });
                    stream.on("error", error => {
                        msg.channel.send("There was an error while playing the video-").catch(e => { console.log(e); });
                        console.error(error);
                        bot.vm.removeConnection(bot, id, error);
                    });

                    var voiceRequest = new bot.VoiceRequest();
                    voiceRequest.url = url;
                    voiceRequest.info = info;
                    voiceRequest.requestMessageID = msg.id;
                    voiceRequest.uuid = bot.crypto.randomBytes(16).toString("hex");
                    voiceRequest.requestChannelID = msg.channel.id;
                    voiceRequest.requestUserID = msg.member.id;
                    voiceRequest.stream = stream;

                    voiceData = bot.vm.connections.get(id);
                    voiceData.current = voiceRequest;
                    voiceData.persistentQueue = [ voiceRequest ]
                    bot.vm.connections.set(id, voiceData);

                    let currentLength2 = bot.tc.convertString_yt2(currentLength);

                    if(info.duration === "P0D") {
                        currentLength2 = "Livestream";
                    }

                    msg.channel.send("Playing `" + info.title + "` *(" + currentLength2 + ")*-").catch(e => { console.log(e); });
                    console.log("- [voice] Playing VoiceRequest for VoiceConnection(id: " + id + ", size: " + voiceData.queue.length + ")");
                    break;
                }
            }
        } else {
            switch(info) {
                case 0:
                    bot.vm.getUrlInfoAndPlay(bot, msg, url, logAdded);
                    break;

                case -2:
                    msg.channel.send("Failed to get video info(url: `" + url + "`)-").catch(e => { console.log(e); });
                    break;

                default: {
                    const currentLength = bot.tc.decideConvertString_yt(info.duration);

                    var voiceRequest = new bot.VoiceRequest();
                    voiceRequest.url = url;
                    voiceRequest.info = info;
                    voiceRequest.requestMessageID = msg.id;
                    voiceRequest.uuid = bot.crypto.randomBytes(16).toString("hex");
                    voiceRequest.requestChannelID = msg.channel.id;
                    voiceRequest.requestUserID = msg.member.id;
                    voiceData.queue.push(voiceRequest);
                    voiceData.persistentQueue.push(voiceRequest);
                    bot.vm.connections.set(id, voiceData);

                    var length = voiceData.queue.length;
                    let currentLength2 = bot.tc.convertString_yt2(currentLength);
                    if(info.duration === "P0D") {
                        currentLength2 = "Livestream";
                    }

                    if(logAdded === true) {
                        msg.channel.send("Added `" + info.title + "` *(" + currentLength2 + ")* to the queue (`" + length + "` in the queue)-").catch(e => { console.log(e); });
                        console.log("- [voice] Added new VoiceRequest to the queue of VoiceConnection(id: " + id + ", size: " + length + ")");
                    }
                    break;
                }
            }
        }
    }

    async tryPlayingNext(bot, id) {
        if(bot.vm.connections.has(id) === true) {
            var voiceData = bot.vm.connections.get(id);
            if(voiceData.mode === 1 && voiceData.queue.length < 1) {
                voiceData.persistentQueue.forEach(voiceRequest => {
                    voiceData.queue.push(voiceRequest)
                })

                console.log("- [voice] Renewed queue in VoiceConnection(id: " + id + ", new size: " + voiceData.queue.length + ")");
            }

            if(voiceData.queue.length > 0) {
                var voiceRequest = voiceData.queue[0];
                var stream = voiceData.connection.play(await bot.ytdl(voiceRequest.url, { quality: 'highestaudio' }).catch(e => { console.log(e); }), { type: 'opus', highWaterMark: 50 });
                voiceData.elapsedMilis = 0;
                stream.on("finish", () => {
                    voiceData.current = -1;
                    if(voiceData.mode === 0) {
                        voiceData.persistentQueue.shift();
                    }

                    try {
                        bot.vm.tryPlayingNext(bot, id);
                    } catch(error) {
                        console.error(error);
                    }
                });
        
                stream.on("error", async(error) => {
                    var guild = await bot.guilds.fetch(id).catch(e => { console.log(e); });
                    var channel = await guild.channels.fetch(voiceRequest.requestChannelID).catch(e => { console.log(e); });
                    channel.send("There was an error while playing the video-").catch(e => { console.log(e); });
                    console.error(error);
                    bot.vm.removeConnection(bot, id, error);
                });

                voiceRequest.stream = stream;
                voiceData.current = voiceRequest;

                var length = voiceData.queue.length - 1;
                var currentLength = bot.tc.decideConvertString_yt(voiceRequest.info.duration);
                let currentLength2 = bot.tc.convertString_yt2(currentLength);
                if(voiceRequest.info.duration === "P0D") {
                    currentLength2 = "Livestream";
                }

                var guild = await bot.guilds.fetch(id).catch(e => { console.log(e); });
                var channel = await guild.channels.fetch(voiceRequest.requestChannelID).catch(e => { console.log(e); });
                if(channel != null) {
                    channel.send("Playing `" + voiceRequest.info.title + "` *(" + currentLength2 +  ")* (`" + length + "` in the queue)-").catch(e => { console.log(e); });
                }

                voiceData.queue.shift();
            }

            bot.vm.connections.set(id, voiceData);
        }
    }

    getUrlInfoAndPlay(bot, msg, url, logAdded) {
        let info = -1;
        let id = -1;
        if(url.includes("youtube.com/watch?v=")) {
            let end0 = url.indexOf("youtube.com/watch?v=") + "youtube.com/watch?v=".length;
            let end1 = end0 + 11;
            id = url.substring(end0, end1);
        } else if(url.includes("youtu.be/")) {
            let end0 = url.indexOf("youtu.be/") + "youtu.be/".length;
            let end1 = end0 + 11;
            id = url.substring(end0, end1);
        } else {
            info = {
                title: url
            }
    
            bot.vm.playOnConnection(bot, msg, url, info, logAdded);
            return;
        }

        bot.ytinfo.retrieve(id, function(error, result) {
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
                duration: bot.tc.convertString_yt2(bot.tc.convertString(bot.tc.convertTime(duration * 1000)))
            }

            if (error || result_m === undefined) {
                bot.vm.playOnConnection(bot, msg, url, -2, logAdded);
            } else {
                bot.vm.playOnConnection(bot, msg, url, result_m, logAdded);
            }
        });
    }
}

module.exports = VoiceManager;