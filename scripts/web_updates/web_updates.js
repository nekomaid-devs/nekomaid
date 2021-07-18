module.exports = {
    async refresh_status(global_context) {
        if(global_context.bot.neko_data.shards_ready === false) { return; }
        
        let guild_count = 0;
        await global_context.bot.shard.broadcastEval('this.guilds.cache.size').then(results => {
            guild_count = results.reduce((prev, guild_count) =>
                prev + guild_count, 0
            );
        }).catch(e => { global_context.logger.error(e); }); 

        let statuses = [
            "V2 live now!"
        ]
        global_context.bot.user.setStatus('available');
        global_context.bot.user.setActivity(`${global_context.utils.pick_random(statuses)} | ${guild_count} servers`, { type: 'PLAYING' });
    },

    async refresh_website(global_context) {
        if(global_context.bot.neko_data.shards_ready === false || global_context.config.nekomaid_API_update_stats === false) { return; }

        let shard_list = [];
        for(let i = 0; i < global_context.bot.shard.count; i++) {
            shard_list[i] = { online: true };
        }

        await global_context.bot.shard.broadcastEval('this.neko_data.uptime_start')
        .then(results => {
            results.forEach((start, i) => {
                shard_list[i].start = start;
            });
        }).catch(e => { global_context.logger.error(e); });

        await global_context.bot.shard.broadcastEval('this.guilds.cache.size')
        .then(results => {
            results.forEach((guilds, i) => {
                shard_list[i].guilds = guilds;
            });
        }).catch(e => { global_context.logger.error(e); });
        await global_context.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
        .then(results => {
            results.forEach((users, i) => {
                shard_list[i].users = users;
            });
        }).catch(e => { global_context.logger.error(e); });
        // TODO: maybe change this, since we don't cache channels?
        await global_context.bot.shard.broadcastEval('this.channels.cache.size')
        .then(results => {
            results.forEach((channels, i) => {
                shard_list[i].channels = channels;
            });
        }).catch(e => { global_context.logger.error(e); });

        await global_context.bot.shard.broadcastEval('this.neko_data.processed_events')
        .then(results => {
            results.forEach((processed_events, i) => {
                shard_list[i].processed_events = processed_events;
            });
        }).catch(e => { global_context.logger.error(e); });
        await global_context.bot.shard.broadcastEval('this.neko_data.total_events')
        .then(results => {
            results.forEach((total_events, i) => {
                shard_list[i].total_events = total_events;
            });
        }).catch(e => { global_context.logger.error(e); });
        await global_context.bot.shard.broadcastEval('this.neko_data.processed_messages')
        .then(results => {
            results.forEach((processed_messages, i) => {
                shard_list[i].processed_messages = processed_messages;
            });
        }).catch(e => { global_context.logger.error(e); });
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
        }).catch(e => { global_context.logger.error(e); });
        await global_context.bot.shard.broadcastEval('this.neko_data.total_commands')
        .then(results => {
            results.forEach((total_commands, i) => {
                shard_list[i].total_commands = total_commands;
            });
        }).catch(e => { global_context.logger.error(e); });
        
        await global_context.bot.shard.broadcastEval('this.neko_data.vm_connections')
        .then(results => {
            results.forEach((voice_connections, i) => {
                shard_list[i].voice_connections = voice_connections;
            });
        }).catch(e => { global_context.logger.error(e); });

        let command_list = Array.from(global_context.commands.values()).filter(e => { return e.hidden === false; }).reduce((acc, curr) => { acc.push({ name: curr.name, description: curr.description, category: curr.category, aliases: curr.aliases }); return acc; }, []);
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

        global_context.modules.axios.post(`${global_context.config.nekomaid_API_endpoint}/v1/stats/post`, { stats: stats }, {
            headers: global_context.data.default_headers
        }).catch(e => {
            global_context.logger.error("[Nekomaid API] " + e)
        })
    },
  
    async refresh_bot_list(global_context) {
        if(global_context.config.dev_mode === true || global_context.config.nekomaid_API_update_bot_lists === false) { return; }

        let guild_count = 0;
        let user_count = 0;
        await global_context.bot.shard.broadcastEval('this.guilds.cache.size')
        .then(results => {
            guild_count = results.reduce((prev, guild_count) =>
                prev + guild_count, 0
            );
        }).catch(e => { global_context.logger.error(e); });
        await global_context.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
        .then(results => {
            user_count = results.reduce((prev, user_count) =>
                prev + user_count, 0
            );
        }).catch(e => { global_context.logger.error(e); });
    
        let data_1 = {
            guilds: guild_count,
            users: user_count
        }
        let data_2 = {
            guildCount: guild_count,
            shardCount: global_context.bot.shard.count
        }
        let data_3 = {
            server_count: guild_count,
            shard_count: global_context.bot.shard.count
        }
    
        let headers_POST_1 = {
            "Content-Type": 'application/json',
            "Authorization": global_context.bot.config.discord_bot_list_API_key
        }
        let headers_POST_2 = {
            "Content-Type": 'application/json',
            "Authorization":global_context. bot.config.discord_bots_API_key,
            "User-Agent": `NekoMaid-4177/1.0 (discord.js; +nekomaid.xyz) DBots/${command_data.global_context.bot.user.id}`
        }
        let headers_POST_3 = {
            "Content-Type": 'application/json',
            "Authorization": global_context.bot.config.discord_boats_API_key
        }
        let headers_POST_4 = {
            "Content-Type": 'application/json',
            "Authorization": global_context.bot.config.bots_for_discord_API_key
        }
        let headers_POST_5 = {
            "Content-Type": 'application/json',
            "Authorization": global_context.bot.config.top_gg_API_key
        }
    
        global_context.modules.axios.post(`https://discordbotlist.com/api/v1/bots/${command_data.global_context.bot.user.id}/stats`, data_1, {
            headers: headers_POST_1
        }).catch(e => {
            global_context.logger.error("[Discord Botlist] " + e)
        })
    
        global_context.modules.axios.post(`https://discord.bots.gg/api/v1/bots/${command_data.global_context.bot.user.id}/stats`, data_2, {
            headers: headers_POST_2
        }).catch(e => {
            global_context.logger.error("[Discord Bots] " + e)
        })

        global_context.modules.axios.post(`https://discord.boats/api/bot/${command_data.global_context.bot.user.id}`, data_3, {
            headers: headers_POST_3
        }).catch(e => {
            global_context.logger.error("[Discord Boats] " + e)
        })

        global_context.modules.axios.post(`https://botsfordiscord.com/api/bot/${command_data.global_context.bot.user.id}`, data_3, {
            headers: headers_POST_4
        }).catch(e => {
            global_context.logger.error("[Bots For Discord] " + e)
        })

        global_context.modules.axios.post(`https://top.gg/api/bots/${command_data.global_context.bot.user.id}/stats`, data_3, {
            headers: headers_POST_5
        }).catch(e => {
            global_context.logger.error("[Top GG] " + e)
        })
    }
}