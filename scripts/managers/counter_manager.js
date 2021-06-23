class CounterManager {
    constructor(global_context) {
        this.global_context = global_context;
        //setInterval(this.updateAllCounters, 60000, this);
    }

    /*updateAllCounters(cm) {
        cm.bot.guilds.cache.forEach(server => {
            if(cm.bot.isDatabaseReady === true && server.me !== undefined && server.me !== null && server.me.hasPermission("MANAGE_CHANNELS") === true) {
                cm.updateCounters(cm, server);
            }
        })
    }

    async updateCounters(cm, server) {
        var serverConfig = await cm.bot.ssm.server_fetch.fetch(cm.bot, { type: "server", id: server.id, containExtra: true });
        var wasEdited = false;
        var newCounters = [];
        serverConfig.counters.forEach(async function(counter) {
            var end = new Date();
            var start = new Date(counter.lastUpdate);

            var diff = (end.getTime() - start.getTime()) / 1000;
            diff /= 60;
            diff = Math.abs(Math.round(diff));
        
            if(diff >= 5) {
                counter.lastUpdate = end.toUTCString();
                var channel = server.channels.cache.get(counter.channelID);

                if(channel !== undefined) {
                    switch(counter.type) {
                        case "allMembers":
                            channel.setName("All Members: " + server.memberCount).catch(err => { console.error(err) });
                            break;

                        case "members": {
                            let memberCount = 0;
                            server.members.cache.forEach(member => {
                                if(member.user.bot === false) {
                                    memberCount += 1;
                                }
                            })

                            channel.setName("Members: " + memberCount).catch(err => { console.error(err) });
                            break;
                        }

                        case "bots":
                            var botCount = 0;
                            server.members.cache.forEach(member => {
                                if(member.user.bot === true) {
                                    botCount += 1;
                                }
                            });

                            channel.setName("Bots: " + botCount).catch(err => { console.error(err) });
                            break;
                        
                        case "botServers":
                            var guildCount = 0;
                            await cm.bot.shard.fetchClientValues('guilds.cache.size')
                                .then(results => {
                                guildCount = results.reduce((prev, guildCount) =>
                                    prev + guildCount, 0
                                );
                            });

                            channel.setName("Current Servers: " + guildCount).catch(err => { console.error(err) });
                            break;

                        case "botUsers": {
                            let memberCount = 0;
                            await cm.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
                                .then(results => {
                                memberCount = results.reduce((prev, memberCount) =>
                                    prev + memberCount, 0
                                );
                            });

                            channel.setName("Current Users: " + memberCount).catch(err => { console.error(err) });
                            break;
                        }

                        default:
                            console.log("Invalid counter type - " + counter.type + " (" + typeof counter.type + ")")
                            break;
                    }
                }

                wasEdited = true;
            }

            newCounters.push(counter);
        })

        if(wasEdited === true) {
            serverConfig.counters = newCounters;
            cm.bot.ssm.server_edit.edit(cm.bot.ssm, { type: "server", id: server.id, server: serverConfig });
        }
    }*/
}

module.exports = CounterManager;