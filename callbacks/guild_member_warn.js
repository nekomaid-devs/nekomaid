module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberWarn", async(warn) => {
            try {
                await this.process(global_context, warn);
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

    async process(global_context, warn) {
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_warn", id: warn.member.guild.id });

        if(server_config.audit_warns == true && server_config.audit_channel != "-1") {
            let channel = await warn.member.guild.channels.fetch(server_config.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let url = warn.member.user.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedWarn = {
                    author: {
                        name: `Case ${server_config.caseID}# | Warn | ${warn.member.user.tag}`,
                        icon_url: url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: warn.member.user,
                            inline: true
                        },
                        {
                            name: "Moderator:",
                            value: warn.moderator,
                            inline: true
                        },
                        {
                            name: "Reason:",
                            value: warn_reason
                        },
                        {
                            name: "Strikes:",
                            value: `${num_of_warnings} => ${(num_of_warnings + 1)}`
                        }
                    ]
                }

                server_config.caseID += 1;
                global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server", id: warn.member.guild.id, server: server_config });

                channel.send("", { embed: embedWarn }).catch(e => { console.log(e); });
            }
        }

        let server_warning = {
            id: global_context.modules.crypto.randomBytes(16).toString("hex"),
            serverID: warn.member.guild.id,
            userID: warn.member.user.id,
            start: Date.now(),
            reason: warn.reason
        }

        global_context.neko_modules_clients.ssm.server_add.add_server_warning(global_context, server_warning, warn.member.guild);
    }
}