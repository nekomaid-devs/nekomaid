class CounterManager {
    constructor(global_context) {
        this.global_context = global_context;

        setInterval(this.update_all_counters, 60000, global_context);
    }

    update_all_counters(global_context) {
        global_context.bot.guilds.cache.forEach(server => {
            if(server.me.hasPermission("MANAGE_CHANNELS") === true) {
                global_context.neko_modules_clients.cm.update_counters(global_context, server);
            }
        })
    }

    async update_counters(global_context, server, force_update = false) {
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server", id: server.id, containExtra: true });
        let was_edited = false;
        let new_counters = [];

        // TODO: add force update argument and move first update from config here
        for(let i = 0; i < server_config.counters.length; i++) {
            let counter = server_config.counters[i];

            let end = new Date();
            let start = new Date(counter.lastUpdate);
            let diff = (end.getTime() - start.getTime()) / 1000;
            diff /= 60;
            diff = Math.abs(Math.round(diff));
        
            if(diff >= 5 || force_update === true) {
                counter.lastUpdate = end.toUTCString();

                let channel = await global_context.bot.channels.fetch(counter.channelID);
                if(channel !== undefined) {
                    switch(counter.type) {
                        case "allMembers":
                            await global_context.utils.verify_guild_members(server);
                            let member_count = Array.from(server.members.cache.values()).length;
                            channel.setName(`All Members: ${member_count}`).catch(err => { console.error(err) });
                            break;

                        case "members": {
                            await global_context.utils.verify_guild_members(server);
                            let member_count = Array.from(server.members.cache.values()).filter(e => { return e.user.bot === false; }).length;
                            channel.setName(`Members: ${member_count}`).catch(err => { console.error(err) });
                            break;
                        }

                        case "bots":
                            await global_context.utils.verify_guild_members(server);
                            let bot_count = Array.from(server.members.cache.values()).filter(e => { return e.user.bot === false; }).length;
                            channel.setName(`Bots: ${bot_count}`).catch(err => { console.error(err) });
                            break;
                        
                        case "botServers":
                            let guild_count = 0;
                            await cm.bot.shard.fetchClientValues("guilds.cache.size")
                            .then(results => {
                                guild_count = results.reduce((prev, guild_count) =>
                                    prev + guild_count, 0
                                );
                            });

                            channel.setName(`Current Servers: ${guild_count}`).catch(err => { console.error(err) });
                            break;

                        case "botUsers": {
                            let member_count = 0;
                            await cm.bot.shard.broadcastEval("this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)")
                            .then(results => {
                                member_count = results.reduce((prev, member_count) =>
                                    prev + member_count, 0
                                );
                            });

                            channel.setName(`Current Users: ${member_count}`).catch(err => { console.error(err) });
                            break;
                        }

                        default:
                            console.log(`Invalid counter type - ${counter.type}.`)
                            break;
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