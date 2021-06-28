module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberAdd", async(member) => {
            try {
                await this.process(global_context, member);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, member) {
        /*
        //Get server's config
        var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_guildmember_add", id: member.guild.id });
        var serverMutes = await bot.ssm.server_fetch.fetch(bot, { type: "serverMutes", id: member.guild.id });
    
        //Give auto roles
        member.guild.roles.cache.forEach(role => {
            if(serverConfig.autoRoles.includes(role.id) === true) {
                member.roles.add(role);
            }
        });

        //Give muted role back
        var muteRole = await member.guild.roles.fetch(serverConfig.muteRoleID).catch(e => { console.log(e); });
        if(muteRole !== undefined) {
            serverMutes.forEach(mute => {
                if(mute.userID === member.user.id) {
                    member.roles.add(muteRole);
                }
            });
        }
    
        //Send a welcomeMessage if welcomeMessages are on
        if(serverConfig.welcomeMessages == true) {
            if(member.guild.channels.cache.has(serverConfig.welcomeMessages_channel) === false) {
                //console.log("[welcomeMessages] Invalid channel(id:" + serverConfig.welcomeMessages_channel + ", serverID:" + member.guild.id + ")-");
                return;
            }
        
            var format = serverConfig.welcomeMessages_format;
            var memberDisplayNameText = serverConfig.welcomeMessages_ping ? `${member}` : "**" + memberDisplayName + "**";
            format = format.replace("%user%", memberDisplayNameText);
            var channel = await member.guild.channels.fetch(serverConfig.welcomeMessages_channel).catch(e => { console.log(e); });
            channel.send(format).catch(e => { console.log(e); });
        }

        var logMembers = true;
        if(logMembers) {
            //var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, member.guild.id);
            
            //var log = { guildID: member.guild.id, type: "guildMemberAdd", userID: member.id, tag: member.user.tag, time: Date.now() }
            //serverLogs.logs.push(log);
            //bot.ssm.server_edit.editServerLogsInStructure(bot.ssm, member.guild, serverLogs);
        }*/
    }
}