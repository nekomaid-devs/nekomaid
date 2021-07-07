module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberClearWarns", async(event) => {
            try {
                await this.process(global_context, event);
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

    async process(global_context, event) {
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_warn", id: event.member.guild.id });

        if(server_config.audit_warns == true && server_config.audit_channel != "-1") {
            let channel = await event.member.guild.channels.fetch(server_config.audit_channel).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                let url = event.member.user.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedClearWarns = {
                    author: {
                        name: `Case ${server_config.case_ID}# | Cleared warnings | ${event.member.user.tag}`,
                        icon_url: url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: event.member.user,
                            inline: true
                        },
                        {
                            name: "Moderator:",
                            value: event.moderator,
                            inline: true
                        },
                        {
                            name: "Reason:",
                            value: event.reason
                        },
                        {
                            name: "Strikes:",
                            value: `${warns.length} => 0`
                        }
                    ]
                }

                server_config.case_ID += 1;
                global_context.neko_modules_clients.ssm.server_edit.edit(global_context, { type: "server", id: event.member.guild.id, server: server_config });

                channel.send("", { embed: embedClearWarns }).catch(e => { global_context.logger.api_error(e); });
            }
        }

        global_context.neko_modules_clients.ssm.server_remove.remove_server_warnings_from_user(global_context, event.member.guild, event.member.user);
    }
}