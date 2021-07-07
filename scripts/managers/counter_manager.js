class CounterManager {
    update_all_counters(global_context) {
        global_context.bot.guilds.cache.forEach(server => {
            // TODO: this will be true, just if we have roles cached, probably make it guess and shoot the update anyways
            if(server.me.hasPermission("MANAGE_CHANNELS") === true) {
                global_context.neko_modules_clients.cm.update_counters(global_context, server);
            }
        })
    }

    async update_counters(global_context, server, force_update = false) {
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server", id: server.id, containExtra: true });
        let was_edited = false;
        let new_counters = [];

        for(let i = 0; i < server_config.counters.length; i++) {
            let counter = server_config.counters[i];

            let end = new Date();
            let start = new Date(counter.last_update);
            let diff = (end.getTime() - start.getTime()) / 1000;
            diff /= 60;
            diff = Math.abs(Math.round(diff));
        
            if(diff >= 5 || force_update === true) {
                counter.last_update = end.toUTCString();

                let channel = await global_context.bot.channels.fetch(counter.channel_ID);
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
                            });

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
                            });

                            channel.setName(`Current Users: ${member_count}`).catch(e => { global_context.logger.api_error(e) });
                            break;
                        }

                        default: {
                            global_context.logger.error(`Invalid counter type - ${counter.type}.`)
                            break;
                        }
                    }
                }

                was_edited = true;
            }

            new_counters.push(counter);
        }

        if(was_edited === true) {
            server_config.counters = new_counters;
            global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server", id: server.id, server: server_config });
        }
    }
}

module.exports = CounterManager;