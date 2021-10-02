class CounterManager {
    async update_all_counters(global_context) {
        let counters = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "all_counters" });
        global_context.bot.guilds.cache.forEach(server => {
            let server_counters = counters.filter(e => { return e.server_ID === server.id; });
            server_counters.forEach(counter => {
                global_context.neko_modules_clients.cm.update_counter(global_context, server, counter);
            });
        });
    }

    async update_counter(global_context, server, counter, force_update = false) {
        let end = new Date();
        let start = new Date(counter.last_update);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));
    
        if(diff >= 5 || force_update === true) {
            counter.last_update = end.getTime();

            let channel = await global_context.bot.channels.fetch(counter.channel_ID).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                switch(counter.type) {
                    case "all_members": {
                        await global_context.utils.verify_guild_members(server);
                        let member_count = Array.from(server.members.cache.values()).length;
                        channel.setName(`All Members: ${member_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    case "members": {
                        await global_context.utils.verify_guild_members(server);
                        let member_count = Array.from(server.members.cache.values()).filter(e => { return e.user.bot === false; }).length;
                        channel.setName(`Members: ${member_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    case "roles": {
                        await global_context.utils.verify_guild_roles(server);
                        let roles_count = Array.from(server.members.cache.values()).length;
                        channel.setName(`Roles: ${roles_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    case "channels": {
                        await global_context.utils.verify_guild_channels(server);
                        let channels_count = Array.from(server.members.cache.values()).length;
                        channel.setName(`Channels: ${channels_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    case "bots": {
                        await global_context.utils.verify_guild_members(server);
                        let bot_count = Array.from(server.members.cache.values()).filter(e => { return e.user.bot === false; }).length;
                        channel.setName(`Bots: ${bot_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }
                    
                    case "bot_servers": {
                        let guild_count = 0;
                        await cm.bot.shard.fetchClientValues("guilds.cache.size")
                        .then(results => {
                            guild_count = results.reduce((prev, guild_count) =>
                                prev + guild_count, 0
                            );
                        }).catch(e => { global_context.logger.error(e); });

                        channel.setName(`Current Servers: ${guild_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    case "bot_users": {
                        let member_count = 0;
                        await cm.bot.shard.broadcastEval("this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)")
                        .then(results => {
                            member_count = results.reduce((prev, member_count) =>
                                prev + member_count, 0
                            );
                        }).catch(e => { global_context.logger.error(e); });

                        channel.setName(`Current Users: ${member_count}`).catch(e => { global_context.logger.api_error(e) });
                        break;
                    }

                    default: {
                        global_context.logger.error(`Invalid counter type - ${counter.type}.`)
                        break;
                    }
                }
            }

            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "counter", counter: counter });
        }
    }
}

module.exports = CounterManager;
