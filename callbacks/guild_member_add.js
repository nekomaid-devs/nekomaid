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
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guildmember_add", id: member.guild.id });
        let server_mutes = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverMutes", id: member.guild.id });

        member.guild.roles.cache.forEach(role => {
            if(server_config.autoRoles.includes(role.id) === true) {
                member.roles.add(role).catch(e => { console.log(e) });
            }
        });
        
        let mute_role = await member.guild.roles.fetch(server_config.muteRoleID).catch(e => { console.log(e); });
        if(mute_role !== undefined) {
            server_mutes.forEach(mute => {
                if(mute.userID === member.user.id) {
                    member.roles.add(mute_role).catch(e => { console.log(e) });
                }
            });
        }

        if(server_config.welcomeMessages == true) {
            let format = server_config.welcomeMessages_format;
            let member_display_name = server_config.welcomeMessages_ping ? `${member}` : "**" + member.user.tag + "**";
            format = format.replace("<user>", member_display_name);

            let channel = await global_context.bot.channels.fetch(server_config.welcomeMessages_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                channel.send(format).catch(e => { console.log(e); });
            }
        }

        let log_members = true;
        if(log_members) {
            //var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, member.guild.id);
            
            //var log = { guildID: member.guild.id, type: "guildMemberAdd", userID: member.id, tag: member.user.tag, time: Date.now() }
            //serverLogs.logs.push(log);
            //bot.ssm.server_edit.editServerLogsInStructure(bot.ssm, member.guild, serverLogs);
        }
    }
}