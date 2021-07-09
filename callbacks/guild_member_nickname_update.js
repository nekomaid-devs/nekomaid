module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberNicknameChange", async(old_member, new_member) => {
            try {
                await this.process(global_context, old_member, new_member);
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

    async process(global_context, old_member, new_member) {
        // TODO: this doesn't work
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_nickname_update", id: new_member.guild.id });
        if(server_config.audit_nicknames == true && server_config.audit_channel !== "-1") {
            let channel = await global_context.bot.channels.fetch(server_config.audit_channel).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                let url = new_member.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
                let embedNicknameChange = {
                    author: {
                        name: `Nickname changed | ${new_member.user.tag}`,
                        icon_url: url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: new_member.user,
                            inline: false
                        },
                        {
                            name: "Change:",
                            value:
                            (old_member.nickname === null ? old_member.user.username : old_member.nickname) + " -> " +
                            (new_member.nickname === null ? new_member.user.username : new_member.nickname)
                        }
                    ]
                }
        
                channel.send("", { embed: embedNicknameChange }).catch(e => { global_context.logger.api_error(e); });
            }
        }
    }
}