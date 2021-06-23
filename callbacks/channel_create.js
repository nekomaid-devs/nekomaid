module.exports = {
    hook(global_context) {
        global_context.bot.on("channelCreate", async(channel) => {
            try {
                if(bot.isDatabaseReady === false || channel.type === "dm") {
                    return;
                }

                bot.totalEvents += 1;
                bot.processedEvents += 1;

                var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_channel_create", id: channel.guild.id });
                if(serverConfig.muteRoleID !== "-1") {
                    var muteRole = await channel.guild.roles.fetch(serverConfig.muteRoleID).catch(e => { console.log(e); });
                    if(muteRole !== undefined) {
                        try {
                            if(channel.type === "text") {
                                channel.createOverwrite(muteRole, {
                                    SEND_MESSAGES: false,
                                    ADD_REACTIONS: false
                                }).catch(e => { console.log(e); });
                            } else if(channel.type === "voice") {
                                channel.createOverwrite(muteRole, {
                                    CONNECT: false,
                                    SPEAK: false
                                }).catch(e => { console.log(e); });
                            }
                        } catch(err) {
                            console.log("[mod] Skipped a permission overwrite because I didn't have permission-")
                        }
                    }
                }
            } catch(e) {
                console.error(e);
            }
        });
    }
}