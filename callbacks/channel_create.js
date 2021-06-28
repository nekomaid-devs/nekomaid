module.exports = {
    hook(global_context) {
        global_context.bot.on("channelCreate", async(channel) => {
            try {
                await this.process(global_context, channel);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, channel) {
        if(channel.type === "dm") {
            return;
        }

        /*var serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server_channel_create", id: channel.guild.id });
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
        }*/
    }
}