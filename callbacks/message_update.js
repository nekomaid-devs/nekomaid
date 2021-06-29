module.exports = {
    hook(global_context) {
        global_context.bot.on("messageUpdate", async(oldMessage, newMessage) => {
            try {
                await this.process(global_context, oldMessage, newMessage);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, oldMessage, newMessage) {
        if(newMessage.channel.type === "dm") {
            return;
        }
        
        let serverConfig = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_message_update", id: newMessage.guild.id });
        if(serverConfig.audit_editedMessages == true && serverConfig.audit_channel != "-1") {
            let channel = await global_context.bot.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let embedMessageEdit = {
                    author: {
                        name: `Message edited | ${newMessage.member.user.tag}`,
                        icon_url: newMessage.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                    },
                    fields: [
                        {
                            name: "User:",
                            value: newMessage.member.user,
                            inline: false
                        },
                        {
                            name: "Change:",
                            value:
                            oldMessage.content + " -> " +
                            newMessage.content
                        }
                    ]
                }
        
                channel.send("", { embed: embedMessageEdit }).catch(e => { console.log(e); });
            }
        }
    }
}