class ReactionRolesManager {
    constructor() {
        /*this.collectors = new Map();*/
    }

    /*createCollectors(rrm) {
        rrm.bot.guilds.cache.forEach(async(server) => {
            if(rrm.bot.isDatabaseReady === true && server.me !== undefined && server.me !== null && server.me.hasPermission("MANAGE_ROLES") === true) {
                var serverConfig = await rrm.bot.ssm.server_fetch.fetch(rrm.bot, { type: "server", id: server.id, containExtra: true });
                serverConfig.reactionRoles.forEach(rr => {
                    this.createCollector(rrm, server, rr);
                });
            }
        })
    }

    async createCollector(rrm, server, rr) {
        if(rrm.bot.channels.cache.has(rr.channelID) === true) {
            var channel = rrm.bot.channels.cache.get(rr.channelID);
            if(channel === undefined) { return; }
            var message = channel.messages.cache.get(rr.messageID);
            if(message === undefined) { return; }

            var filter = (r, u) => u.bot === false

            var collector = message.createReactionCollector(filter, { dispose: true })
            collector.on('collect', (r, user) => {
                rr.reactionRoles.forEach(async(roleID, i) => {
                    var emoji = rr.reactionRoleEmojis[i];
                    if((emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === "<:" + r.emoji.name + ":" + r.emoji.id + ">")) && server.members.cache.has(user.id) === true && server.roles.cache.has(roleID) === true) {
                        var member = await server.members.fetch(user.id).catch(e => { console.log(e); });
                        var role = await server.roles.fetch(roleID).catch(e => { console.log(e); });

                        member.roles.add(role);
                    }
                });
            });

            collector.on('remove', (r, user) => {
                rr.reactionRoles.forEach(async(roleID, i) => {
                    var emoji = rr.reactionRoleEmojis[i];
                    if((emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === "<:" + r.emoji.name + ":" + r.emoji.id + ">")) && server.members.cache.has(user.id) === true && server.roles.cache.has(roleID) === true) {
                        var member = await server.members.fetch(user.id).catch(e => { console.log(e); });
                        var role = await server.roles.fetch(roleID).catch(e => { console.log(e); });

                        member.roles.remove(role);
                    }
                });
            });
        }
    }*/
}

module.exports = ReactionRolesManager;