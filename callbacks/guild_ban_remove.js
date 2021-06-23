module.exports = {
    hook(global_context) {
        global_context.bot.on("guildBanRemove", async(guild, user) => {
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;

            /*var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_guild_banremove", id: guild.id });
            if(serverConfig.audit_bans == true && serverConfig.audit_channel != "-1") {
                var channel = await guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
        
                if(channel !== undefined) {
                    var audit = await guild.fetchAuditLogs()
                    var lastAudit = audit.entries.first()

                    if(lastAudit.action === "MEMBER_BAN_REMOVE" && lastAudit.target.id === user.id) {
                        let executor = -1;
                        if(lastAudit.executor.id === "691398095841263678") {
                            executor = await guild.members.fetch(guild.client.lastModeratorIDs.get(guild.id)).catch(e => { console.log(e); });
                        } else {
                            executor = await guild.members.fetch(lastAudit.executor.id).catch(e => { console.log(e); });
                        }

                        const embedBan = {
                            author: {
                                name: "Case " + serverConfig.caseID + "# | Unban | " + user.tag,
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
            }*/
        });
    }
}