module.exports = {
    hook(global_context) {
        global_context.bot.on("messageUpdate", async(oldMessage, newMessage) => {
            if(oldMessage.channel.type === "dm" || oldMessage.author.bot === true) {
                return;
            }

            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
            
            /*var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_message_update", id: newMessage.guild.id });
            if(serverConfig.audit_editedMessages == true && serverConfig.audit_channel != "-1") {
                var channel = await newMessage.guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
        
                if(channel !== undefined) {
                    const embedMessageEdit = {
                        author: {
                            name: "Message edited | " + newMessage.member.user.tag,
                            icon_url: newMessage.member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
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
            }*/
        });
    }
}