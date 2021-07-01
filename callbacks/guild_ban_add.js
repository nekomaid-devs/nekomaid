module.exports = {
    hook(global_context) {
        global_context.bot.on("guildBanAdd", async(guild, user) => {
            try {
                await this.process(global_context, guild, user);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, guild, user) {
        // TODO: this should add Nekomaid's bans aswell
        // TODO: also we should check for uncaught bans somewhere else
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_ban_add", id: guild.id });
        if(server_config.audit_bans == true && server_config.audit_channel != "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let audit = await guild.fetchAuditLogs();
                let last_audit = audit.entries.first();

                if(last_audit.action === "MEMBER_BAN_ADD" && last_audit.target.id === user.id) {
                    let executor = -1;
                    if(last_audit.executor.id === global_context.bot.user.id) {
                        executor = await global_context.bot.users.fetch(global_context.data.last_moderator_IDs.get(guild.id)).catch(e => { console.log(e); });
                    } else {
                        executor = await global_context.bot.users.fetch(last_audit.executor.id).catch(e => { console.log(e); });
                    }

                    // TODO: add duration of ban (if available)
                    let url = user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                    let embedBan = {
                        author: {
                            name: `Case ${server_config.caseID}# | Ban | ${user.tag}`,
                            icon_url: url,
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
                                value: last_audit.reason === null ? "None" : last_audit.reason
                            }
                        ]
                    }

                    server_config.caseID += 1;
                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server_cb", id: guild.id, server: server_config });
            
                    channel.send("", { embed: embedBan }).catch(e => { console.log(e); });
                }
            }
        }
    }
}