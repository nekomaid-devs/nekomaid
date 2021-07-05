class ModerationManager {
    constructor() {
        /*setInterval(this.timeoutAllBans, 10000, this);
        setInterval(this.timeoutAllMutes, 10000, this);*/
    }

    /*async timeoutAllMutes(moderator) {
        var allMutes = await moderator.bot.ssm.server_fetch.fetch(moderator.bot, { type: "all_server_mutes" });
        moderator.bot.guilds.cache.forEach(server => {
            let serverMutes = allMutes.filter(e => { return e.serverID === server.id; });
            if(moderator.bot.isDatabaseReady === true && server.me !== undefined && server.me !== null && server.me.hasPermission("MANAGE_ROLES") === true) {
                moderator.timeoutMutes(moderator, server, serverMutes);
            }
        })
    }

    async timeoutMutes(moderator, server, serverMutes) {
        var now = Date.now();
        var mutesToRemove = []
        var userIDsToUnmute = []

        serverMutes.forEach(function(mute) {
            if(mute.end != -1 && mute.end - now < 0) {
                mutesToRemove.push(mute)
                userIDsToUnmute.push(mute.userID)
            }
        });

        var serverConfig = await moderator.bot.ssm.server_fetch.fetch(moderator.bot, { type: "server", id: server.id });
        if(serverMutes.length < 0 || serverConfig.muteRoleID === "-1") { return; }
        
        mutesToRemove.forEach(mute => {
            moderator.bot.ssm.server_remove.remove_server_mute(moderator.bot.ssm, mute.id);
        })
        userIDsToUnmute.forEach(async(userID) => {
            var mutedUser = await server.members.fetch(userID).catch(e => { console.log(e); });
            
            if(mutedUser !== undefined) {
                console.log("[mod] Unmuted " + mutedUser.user.username + "#" + mutedUser.user.discriminator + " due to mute expiration-")
                mutedUser.roles.remove(serverConfig.muteRoleID).catch(e => { console.log(e); });
            }
        })
    }

    async timeoutAllBans(moderator) {
        let allBans = await moderator.bot.ssm.server_fetch.fetch(moderator.bot, { type: "all_server_bans" });
        moderator.bot.guilds.cache.forEach(server => {
            let serverBans = allBans.filter(e => { return e.serverID === server.id; });
            if(moderator.bot.isDatabaseReady === true && server.me !== undefined && server.me !== null && server.me.hasPermission("MANAGE_ROLES") === true) {
                moderator.timeoutBans(moderator, server, serverBans);
            }
        })
    }

    async timeoutBans(moderator, server, serverBans) {
        var now = Date.now();
        var bansToRemove = []
        var userIDsToUnban = []

        serverBans.forEach(function(ban) {
            if(ban.end != -1 && ban.end - now < 0) {
                bansToRemove.push(ban)
                userIDsToUnban.push(ban.userID);
            }
        });
        if(serverBans.length < 0) { return; }

        bansToRemove.forEach(ban0 => {
            server.fetchBans().then(serverBansResult => {
                serverBansResult.forEach(ban => {
                    if(userIDsToUnban.includes(ban.user.id)) {
                        console.log("[mod] Unbanned " + ban.user.username + "#" + ban.user.discriminator + " due to ban expiration-")
                        server.members.unban(ban.user).catch(e => { console.log(e); });
                    }
                });
            })

            moderator.bot.ssm.server_remove.remove_server_ban(moderator.bot.ssm, ban0.id);
        })
    }

    checkAllChannels(moderator) {
        if(moderator.bot.isDatabaseReady === false) { return; }

        console.log("[mod] Regenerating permissions for channels (size: " + moderator.bot.channels.cache.size + ")-")
        moderator.bot.guilds.cache.forEach(server => {
            moderator.checkChannels(moderator, server);
        })

        console.log("[mod] Regenerated permissions-")
    }

    async checkChannels(moderator, server) {
        if(moderator.bot.isDatabaseReady === true && server.me !== undefined && server.me !== null && server.me.hasPermission("MANAGE_ROLES") === true) {
            var serverConfig = await moderator.bot.ssm.server_fetch.fetch(moderator.bot, { type: "server", id: server.id });
            var muteRole = await server.roles.fetch(serverConfig.muteRoleID).catch(e => { console.log(e); });
            if(muteRole !== undefined) {
                server.channels.cache.forEach(channel => {
                    if(channel.permissionOverwrites.has(muteRole.id) === false) {
                        if(channel.type === "text") {
                            channel.createOverwrite(muteRole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            }).catch(e => { console.log(e); });
                        } else if(channel.type === "voice") {
                            channel.createOverwrite(muteRole, {
                                CONNECT: false,
                                SPEAK: false
                            }).catch(e => { console.log(e); });
                        }

                        console.log("[mod] Regenerated permissions for channel(id: " + channel.id + ")-")
                    }
                })
            }
        }
    }*/
}

module.exports = ModerationManager