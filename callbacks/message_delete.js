module.exports = {
    hook(global_context) {
        global_context.bot.on("messageDelete", async(message) => {
            try {
                await this.process(global_context, message);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
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
        
        /*var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_message_delete", id: message.guild.id });
        if(serverConfig.audit_deletedMessages == true && serverConfig.audit_channel != "-1") {
            var channel = await message.guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
    
            if(channel !== undefined) {
                const embedDeletedMessage = {
                    author: {
                        name: "Message Deleted | " + message.member.user.tag,
                        icon_url: message.member.user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
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
        }*/
    }
}