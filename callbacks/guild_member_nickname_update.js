module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberNicknameChange", async(oldMember, newMember) => {
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
                
            /*var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_guildmember_nicknamechange", id: newMember.guild.id });
            if(serverConfig.audit_nicknames == true && serverConfig.audit_channel != "-1") {
                var channel = await newMember.guild.channels.fetch(serverConfig.audit_channel).catch(e => { console.log(e); });
        
                if(channel !== undefined) {
                    const embedNicknameChange = {
                        author: {
                            name: "Nickname changed | " + newMember.user.tag,
                            icon_url: newMember.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
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
            
                    channel.send("", { embed: embedNicknameChange }).catch(e => { console.log(e); });
                }
            }*/
        });
    }
}