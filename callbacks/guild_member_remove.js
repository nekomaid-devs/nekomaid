module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberRemove", async(member) => {
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
            
            /*
            //Get server's config
            var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_guildmember_remove", id: member.guild.id });
        
            //Send a leaveMessage if leaveMessages are on
            if(serverConfig.leaveMessages == true) {
                if(member.guild.channels.cache.has(serverConfig.leaveMessages_channel) == false) {
                    //console.log("[leaveMessages] Invalid channel(id:" + serverConfig.leaveMessages_channel + ", serverID:" + member.guild.id + ")-");
                    return;
                }
        
                var format = serverConfig.leaveMessages_format;
                var memberDisplayNameText = "**" + memberDisplayName + "**";
                format = format.replace("%user%", memberDisplayNameText);
                var channel = await member.guild.channels.fetch(serverConfig.leaveMessages_channel).catch(e => { console.log(e); });
                channel.send(format).catch(e => { console.log(e); });
            }

            var logMembers = true;
            if(logMembers) {
                //var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, member.guild.id);
                
                //var log = { guildID: member.guild.id, type: "guildMemberRemove", userID: member.id, tag: member.user.tag, time: Date.now() }
                //serverLogs.logs.push(log);
                //bot.ssm.server_edit.editServerLogsInStructure(bot.ssm, member.guild, serverLogs);
            }

            if(serverConfig.audit_kicks == true && serverConfig.audit_channel != "-1") {
                var channel = await member.guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    var audit = await member.guild.fetchAuditLogs()
                    var lastAudit = audit.entries.first()

                    if(lastAudit.action === "MEMBER_KICK" && lastAudit.target.id === member.user.id) {
                        let executor = -1;
                        if(lastAudit.executor.id === "691398095841263678") {
                            executor = await member.guild.members.fetch(member.guild.client.lastModeratorIDs.get(member.guild.id)).catch(e => { console.log(e); });
                        } else {
                            executor = await member.guild.members.fetch(lastAudit.executor.id).catch(e => { console.log(e); });
                        }

                        const embedKick = {
                            author: {
                                name: "Kick | " + lastAudit.target.tag,
                                icon_url: lastAudit.target.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
                            },
                            fields: [
                                {
                                    name: "User:",
                                    value: lastAudit.target.tag,
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
    
                        channel.send("", { embed: embedKick }).catch(e => { console.log(e); });
                    }
                }
            }*/
        });
    }
}