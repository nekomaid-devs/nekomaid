module.exports = {
    hook(global_context) {
        global_context.bot.on("messageDelete", async(message) => {
            try {
                await this.process(global_context, message);
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

    async process(global_context, message) {
        if(message.channel.type === "dm") {
            return;
        }
        
        let serverConfig = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_message_delete", id: message.guild.id });
        if(serverConfig.audit_deletedMessages == true && serverConfig.audit_channel != "-1") {
            let channel = await global_context.bot.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let url = message.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                let embedDeletedMessage = {
                    author: {
                        name: `Message Deleted | ${message.member.user.tag}`,
                        icon_url: url,
                    },
                    fields: [
                        {
                            name: "User:",
                            value: message.member.user,
                            inline: true
                        },
                        {
                            name: "Channel:",
                            value: message.channel,
                            inline: true
                        },
                        {
                            name: "Message:",
                            value: "~~" + message.content + "~~"
                        }
                    ]
                }
        
                channel.send("", { embed: embedDeletedMessage }).catch(e => { console.log(e); });
            }
        }
    }
}