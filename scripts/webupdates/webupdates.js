module.exports = {
    async refresh_status(global_context) {
        let guild_count = 0;
        await global_context.bot.shard.fetchClientValues('guilds.cache.size').then(results => {
            guild_count = results.reduce((prev, guild_count) =>
                prev + guild_count, 0
            );
        }).catch(e => { /*console.log(e);*/ })

        let statuses = [
            "getting bullied by lamkas"
        ]
        global_context.bot.user.setStatus('available');
        global_context.bot.user.setActivity(`${global_context.utils.pick_random(statuses)} | ${guild_count} servers`, { type: 'PLAYING' });
    },

    async refresh_website(global_context) {
        if(global_context.bot.shard.ids[0] !== 0) { return; }

        let shard_list = [];
        for(let i = 0; i < global_context.bot.shard.count; i++) {
            shard_list[i] = { online: true };
        }

        await global_context.bot.shard.broadcastEval('this.neko_data.uptime_start')
        .then(results => {
            results.forEach((start, i) => {
                shard_list[i].start = start;
            });
        });

        await global_context.bot.shard.broadcastEval('this.guilds.cache.size')
        .then(results => {
            results.forEach((guilds, i) => {
                shard_list[i].guilds = guilds;
            });
        });
        await global_context.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
        .then(results => {
            results.forEach((users, i) => {
                shard_list[i].users = users;
            });
        });
        // TODO: maybe change this, since we don't cache channels?
        await global_context.bot.shard.broadcastEval('this.channels.cache.size')
        .then(results => {
            results.forEach((channels, i) => {
                shard_list[i].channels = channels;
            });
        });

        await global_context.bot.shard.broadcastEval('this.neko_data.processed_events')
        .then(results => {
            results.forEach((processed_events, i) => {
                shard_list[i].processed_events = processed_events;
            });
        });
        await global_context.bot.shard.broadcastEval('this.neko_data.total_events')
        .then(results => {
            results.forEach((total_events, i) => {
                shard_list[i].total_events = total_events;
            });
        });
        await global_context.bot.shard.broadcastEval('this.neko_data.processed_messages')
        .then(results => {
            results.forEach((processed_messages, i) => {
                shard_list[i].processed_messages = processed_messages;
            });
        });
        await global_context.bot.shard.broadcastEval('this.neko_data.total_messages')
        .then(results => {
            results.forEach((total_messages, i) => {
                shard_list[i].total_messages = total_messages;
            });
        });
        await global_context.bot.shard.broadcastEval('this.neko_data.processed_commands')
        .then(results => {
            results.forEach((processed_commands, i) => {
                shard_list[i].processed_commands = processed_commands;
            });
        });
        await global_context.bot.shard.broadcastEval('this.neko_data.total_commands')
        .then(results => {
            results.forEach((total_commands, i) => {
                shard_list[i].total_commands = total_commands;
            });
        });
        
        await global_context.bot.shard.broadcastEval('this.neko_data.vm_connections')
        .then(results => {
            results.forEach((voice_connections, i) => {
                shard_list[i].voice_connections = voice_connections;
            });
        });

        let command_list = [];
        global_context.commands.forEach(command => {
            if(command.hidden === false) {
                command_list.push({ name: command.name, description: command.description, category: command.category, aliases: command.aliases })
            }
        });

        let stats = {
            start: global_context.data.uptime_start,
			hosts: 1,

			sentry_online: true,
			analytics_online: true,
			akaneko_online: true,
			uptime_pings: [Array(24).fill({ up: true })],

			shard_list: shard_list,
			command_list: command_list,
			top_list: []
        }

        global_context.modules.axios.post(`https://api.nekomaid.xyz/postStats`, { stats: stats }, {
            headers: global_context.data.default_headers
        })
        .catch(error => {
            console.log("[Nekomaid API] " + error)
        })
    },
  
    async refresh_bot_list(bot) {
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
                "User-Agent": `NekoMaid-4177/1.0 (discord.js; +nekomaid.xyz) DBots/${command_data.global_context.bot.user.id}`
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
        
            bot.axios.post(`https://discordbotlist.com/api/v1/bots/${command_data.global_context.bot.user.id}/stats`, data, {
                headers: headersPOST
            })
            .catch(error => {
                console.log("[POST1] " + error)
            })
        
            bot.axios.post(`https://discord.bots.gg/api/v1/bots/${command_data.global_context.bot.user.id}/stats`, data2, {
                headers: headersPOST2
            })
            .catch(error => {
                console.log("[POST2] " + error)
            })

            bot.axios.post(`https://discord.boats/api/bot/${command_data.global_context.bot.user.id}`, data5, {
                headers: headersPOST4
            })
            .catch(error => {
                console.log("[POST4] " + error)
            })

            bot.axios.post(`https://botsfordiscord.com/api/bot/${command_data.global_context.bot.user.id}`, data5, {
                headers: headersPOST5
            })
            .catch(error => {
                console.log("[POST5] " + error)
            })

            bot.axios.post(`https://top.gg/api/bots/${command_data.global_context.bot.user.id}/stats`, data5, {
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