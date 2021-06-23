module.exports = {
    hook(global_context) {
        global_context.bot.on("channelDelete", async(channel) => {
            try {
                if(bot.isDatabaseReady === false || channel.type === "dm") {
                    return;
                }

                bot.totalEvents += 1;
                bot.processedEvents += 1;
            } catch(e) {
                console.error(e);
            }
        });
    }
}