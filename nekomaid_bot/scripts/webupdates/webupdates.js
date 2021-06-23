module.exports = {
    refreshStatus(bot) {
        try {
            bot.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                var guildCountPOST = results.reduce((prev, guildCountPOST) =>
                    prev + guildCountPOST, 0
                );

                let statuses = [
                    "Maid Battle Royale 2021",
                    "Nekopara",
                    "with cute people",
                    "latest version",
                    "peko peko",
                    "pain peko",
                    "on 6 consoles"
                ]
                var text = bot.pickRandom(statuses) + ' | ' + guildCountPOST + ' servers';
            
                bot.user.setStatus('available');
                bot.user.setActivity(text, { type: 'PLAYING' });
            }).catch(e => { console.log(e); })
        } catch(e) {
            console.log(e);
        }
    },

    async refreshWebsite(bot, top) {
        try {
            if(bot.socketClient === undefined || bot.socketClient.connected === false) { return; } 
            if(bot.shard.ids[0] !== bot.Discord.ShardClientUtil.shardIDForGuildID("713467608363696128", bot.shard.count)) { return; }

            var guildCount = 0;
            var memberCount = 0;
            var channelCount = 0;
            var commandCount = 0;
            var voiceConnections = 0;

            await bot.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                guildCount = results.reduce((prev, guildCount) =>
                    prev + guildCount, 0
                );
            }).catch(e => { /*console.log(e);*/ })

            await bot.shard.fetchClientValues('channels.cache.size')
            .then(results => {
                channelCount = results.reduce((prev, channelCount) =>
                    prev + channelCount, 0
                );
            }).catch(e => { /*console.log(e);*/ })
        
            await bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
            .then(results => {
                memberCount = results.reduce((prev, memberCount) =>
                    prev + memberCount, 0
                );
            }).catch(e => { /*console.log(e);*/ })
        
            await bot.shard.fetchClientValues('vm.connections.size')
            .then(results => {
                voiceConnections = results.reduce((prev, voiceConnections) =>
                    prev + voiceConnections, 0
                );
            }).catch(e => { /*console.log(e);*/ })

            await bot.shard.fetchClientValues('totalCommands')
            .then(results => {
                commandCount = results.reduce((prev, commandCount) =>
                    prev + commandCount, 0
                );
            }).catch(e => { /*console.log(e);*/ })

            let commandList = [];
            bot.commands.forEach(command => {
                if(command.hidden === false) {
                    commandList.push({ name: command.name, description: command.description, category: command.category, aliases: command.aliases })
                }
            })

            var data3 = {
                guilds: guildCount,
                channels: channelCount,
                users: memberCount,
                commands: commandCount,
                voice_connections: voiceConnections,
                shard_count: bot.shard.count,
                start: bot.start,
                commandList: commandList,
                top: top
            }

            bot.socketClient.emit("postStats", data3);
        } catch(e) {
            console.log(e);
        }
    },
  
    async refreshBotList(bot) {
        if(bot.isDeveloper === true) { return; }

        try {
            var guildCount = 0;
            var memberCount = 0;
            var voiceConnections = 0;
        
            await bot.shard.fetchClientValues('guilds.cache.size')
            .then(results => {
                guildCount = results.reduce((prev, guildCount) =>
                    prev + guildCount, 0
                );
            }).catch(e => { console.log(e); })
        
            await bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
            .then(results => {
                memberCount = results.reduce((prev, memberCount) =>
                    prev + memberCount, 0
                );
            }).catch(e => { console.log(e); })
        
            await bot.shard.fetchClientValues('vm.connections.size')
            .then(results => {
                voiceConnections = results.reduce((prev, voiceConnections) =>
                    prev + voiceConnections, 0
                );
            }).catch(e => { console.log(e); })
        
            var data = {
                guilds: guildCount,
                users: memberCount,
                voice_connections: voiceConnections
            }
        
            var data2 = {
                guildCount: guildCount,
                shardCount: bot.shard.count
            }

            var data5 = {
                server_count: guildCount,
                shard_count: bot.shard.count
            }
        
            var headersPOST = {
                "Content-Type": 'application/json',
                "Authorization": bot.globalPersistentConfig.discordBotListAPI_key
            }
        
            var headersPOST2 = {
                "Content-Type": 'application/json',
                "Authorization": bot.globalPersistentConfig.discordBotsAPI_key,
                "User-Agent": "NekoMaid-4177/1.0 (discord.js; +nekomaid.xyz) DBots/691398095841263678"
            }

            var headersPOST4 = {
                "Content-Type": 'application/json',
                "Authorization": bot.globalPersistentConfig.topggAPI_key
            }

            var headersPOST5 = {
                "Content-Type": 'application/json',
                "Authorization": bot.globalPersistentConfig.botsForDiscordAPI_key
            }

            var headersPOST6 = {
                "Content-Type": 'application/json',
                "Authorization": bot.globalPersistentConfig.topggAPI_key
            }
        
            bot.axios.post("https://discordbotlist.com/api/v1/bots/691398095841263678/stats", data, {
                headers: headersPOST
            })
            .catch(error => {
                console.log("[POST1] " + error)
            })
        
            bot.axios.post("https://discord.bots.gg/api/v1/bots/691398095841263678/stats", data2, {
                headers: headersPOST2
            })
            .catch(error => {
                console.log("[POST2] " + error)
            })

            bot.axios.post("https://discord.boats/api/bot/691398095841263678", data5, {
                headers: headersPOST4
            })
            .catch(error => {
                console.log("[POST4] " + error)
            })

            bot.axios.post("https://botsfordiscord.com/api/bot/691398095841263678", data5, {
                headers: headersPOST5
            })
            .catch(error => {
                console.log("[POST5] " + error)
            })

            bot.axios.post("https://top.gg/api/bots/691398095841263678/stats", data5, {
                headers: headersPOST6
            })
            .catch(error => {
                console.log("[POST6] " + error)
            })
        } catch(e) {
            console.log(e);
        }
    },

    sendMessage(bot, message) {
        try {
            if(bot.socketClient === undefined || bot.socketClient.connected === false) { return; } 
            bot.socketClient.emit("postMessage", {
                author: message.author.username,
                content: message.content
            })
        } catch(e) {
            console.log(e);
        }
    },
  
    sendHeartbeat(bot) {
        return;

        try {
            if(bot.socketClient === undefined || bot.socketClient.connected === false) { return; } 
            bot.socketClient.emit("postHeartbeat", {
                ping: Math.round(bot.ws.ping),
                start: bot.start,
                ram: process.memoryUsage().heapTotal,
                shardCount: bot.shard.count,
                shardID: bot.shard.ids[0],
                timestamp: Date.now().toString(),
                processedEvents: bot.processedEvents,
                totalEvents: bot.totalEvents,
                userCount: bot.users.cache.size,
                guildCount: bot.guilds.cache.size,
                totalMessages: bot.totalMessages,
                processedMessages: bot.processedMessages,
                totalCommands: bot.totalCommands,
                processedCommands: bot.processedCommands,
                audioConnections: bot.vm.connections.size 
            })
        } catch(e) {
            console.log(e);
        }
    },

    sendLogServer(bot, log2) {
        return;
        
        bot.axios.post(bot.globalPersistentConfig.webEndpoint + "/log", { type: 9, log: log2 }, {
            headers: bot.headers
        })
        .catch(error => {
            console.error(error)
            console.log("[SERVER_LOGS] " + error)
        })

        //console.log("[web] Sending log-")
    },
}