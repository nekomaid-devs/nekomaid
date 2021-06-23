module.exports = {
    hook(bot) {
        bot.on('guildBanAdd', async function(guild, user) {
            try {
                if(bot.isDatabaseReady === false) {
                    return;
                }

                bot.totalEvents += 1;
                bot.processedEvents += 1;
                
                var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_guild_banadd", id: guild.id });
                console.log("- " + user.tag + " got banned in Guild(name: " + guild.name + ", id: " + guild.id + ", members: " + guild.memberCount + ")");
                console.log(">");

                if(serverConfig.audit_bans == true && serverConfig.audit_channel != "-1") {
                    var channel = await guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
            
                    if(channel !== undefined) {
                        var audit = await guild.fetchAuditLogs()
                        var lastAudit = audit.entries.first()

                        if(lastAudit.action === "MEMBER_BAN_ADD" && lastAudit.target.id === user.id) {
                            let executor = -1;
                            if(lastAudit.executor.id === "691398095841263678") {
                                executor = await guild.members.fetch(guild.client.lastModeratorIDs.get(guild.id)).catch(e => { console.log(e); });
                            } else {
                                executor = await guild.members.fetch(lastAudit.executor.id).catch(e => { console.log(e); });
                            }

                            const embedBan = {
                                author: {
                                    name: "Case " + serverConfig.caseID + "# | Ban | " + user.tag,
                                    icon_url: user.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
                                },
                                fields: [
                                {
                                    name: "User:",
                                    value: user.tag,
                                    inline: true
                                },
                                {
                                    name: "Moderator:",
                                    value: executor,
                                    inline: true
                                },
                                {
                                    name: "Reason:",
                                    value: lastAudit.reason === null ? "None" : lastAudit.reason
                                }
                                ]
                            }

                            //Save edited config
                            serverConfig.caseID += 1;
                            bot.ssm.server_edit.edit(bot.ssm, { type: "server_cb", id: guild.id, server: serverConfig });
                    
                            channel.send("", { embed: embedBan }).catch(e => { console.log(e); });
                        }
                    }
                }
            } catch(e) {
                console.error(e);
            }
        });
    }
}