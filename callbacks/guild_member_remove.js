module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberRemove", async(member) => {
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
        let moderation_action = global_context.data.last_moderation_actions.get(guild.id);
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_remove", id: member.guild.id });

        if(server_config.leaveMessages == true) {
            let format = server_config.leaveMessages_format;
            let member_display_name = "**" + member.user.tag + "**";
            format = format.replace("<user>", member_display_name);

            let channel = await global_context.bot.channels.fetch(server_config.leaveMessages_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                channel.send(format).catch(e => { console.log(e); });
            }
        }

        let log_members = true;
        if(log_members) {
            //var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, member.guild.id);
            
            //var log = { guildID: member.guild.id, type: "guildMemberRemove", userID: member.id, tag: member.user.tag, time: Date.now() }
            //serverLogs.logs.push(log);
            //bot.ssm.server_edit.edit_server_logs_in_structure(bot.ssm, member.guild, serverLogs);
        }
        
        if(server_config.audit_kicks == true && server_config.audit_channel != "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let audit = await member.guild.fetchAuditLogs();
                let last_audit = audit.entries.first();
                if(last_audit.action === "MEMBER_KICK" && last_audit.target.id === member.user.id) {
                    let executor = -1;
                    if(last_audit.executor.id === global_context.bot.user.id) {
                        executor = await member.guild.members.fetch(moderation_action.moderator).catch(e => { console.log(e); });
                        global_context.data.last_moderation_actions.delete(guild.id);
                    } else {
                        executor = await member.guild.members.fetch(last_audit.executor.id).catch(e => { console.log(e); });
                    }

                    let embedKick = {
                        author: {
                            name: `Kick | ${last_audit.target.tag}`,
                            icon_url: last_audit.target.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: last_audit.target.tag,
                                inline: true
                            },
                            {
                                name: "Moderator:",
                                value: executor,
                                inline: true
                            },
                            {
                                name: "Reason:",
                                value: last_audit.reason === null ? "None" : last_audit.reason
                            }
                        ]
                    }

                    channel.send("", { embed: embedKick }).catch(e => { console.log(e); });
                }
            }
        }
    }
}