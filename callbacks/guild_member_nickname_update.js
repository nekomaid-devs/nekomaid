module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberNicknameChange", async(oldMember, newMember) => {
            try {
                await this.process(global_context, oldMember, newMember);
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

    async process(global_context, oldMember, newMember) {
        // TODO: this doesn't work
        let serverConfig = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_guild_member_nickname_update", id: newMember.guild.id });
        if(serverConfig.audit_nicknames == true && serverConfig.audit_channel != "-1") {
            let channel = await global_context.bot.channels.fetch(serverConfig.audit_channel).catch(e => { global_context.logger.api_error(e); });
            if(channel !== undefined) {
                let embedNicknameChange = {
                    author: {
                        name: `Nickname changed | ${newMember.user.tag}`,
                        icon_url: newMember.user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                    },
                    fields: [
                        {
                            name: "User:",
                            value: newMember.user,
                            inline: false
                        },
                        {
                            name: "Change:",
                            value:
                            (oldMember.nickname === null ? oldMember.user.username : oldMember.nickname) + " -> " +
                            (newMember.nickname === null ? newMember.user.username : newMember.nickname)
                        }
                    ]
                }
        
                channel.send("", { embed: embedNicknameChange }).catch(e => { global_context.logger.api_error(e); });
            }
        }
    }
}