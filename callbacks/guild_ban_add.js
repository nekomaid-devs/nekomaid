module.exports = {
    hook(global_context) {
        global_context.bot.on("guildBanAdd", async(guild, user) => {
            try {
                await this.process(global_context, guild, user);
            } catch(e) {
                if(global_context.config.sentry_enabled === true) {
                    global_context.modules.Sentry.captureException(e);
                }
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, guild, user) {
        let moderation_action = global_context.data.last_moderation_actions.get(guild.id);
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_ban_add", id: guild.id });

        if(server_config.audit_bans == true && server_config.audit_channel !== "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                let audit = await guild.fetchAuditLogs();
                let last_audit = audit.entries.first();

                if(last_audit.action === "MEMBER_BAN_ADD" && last_audit.target.id === user.id) {
                    let executor = -1;
                    if(last_audit.executor.id === global_context.bot.user.id) {
                        executor = await global_context.bot.users.fetch(moderation_action.moderator).catch(e => { global_context.logger.api_error(e); });
                    } else {
                        executor = await global_context.bot.users.fetch(last_audit.executor.id).catch(e => { global_context.logger.api_error(e); });
                    }

                    let url = user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                    let embedBan = {
                        author: {
                            name: `Case ${server_config.case_ID}# | Ban | ${user.tag}`,
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
                            },
                            {
                                name: "Duration:",
                                value: moderation_action === undefined ? "Unknown" : moderation_action.duration,
                                inline: true
                            }
                        ]
                    }

                    server_config.case_ID += 1;
                    global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server_cb", server: server_config });
            
                    channel.send("", { embed: embedBan }).catch(e => { global_context.logger.api_error(e); });
                }
            }
        }

        let server_ban = {
            id: global_context.modules.crypto.randomBytes(16).toString("hex"),
            server_ID: guild.id,
            user_ID: user.id,
            start: moderation_action !== undefined ? moderation_action.start : Date.now(),
            reason: moderation_action !== undefined ? moderation_action.reason : "None",
            end: moderation_action !== undefined ? moderation_action.end : -1
        }
        global_context.neko_modules_clients.ssm.server_add.add_server_ban(global_context, server_ban);
        global_context.data.last_moderation_actions.delete(guild.id);
    }
}