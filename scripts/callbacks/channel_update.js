module.exports = {
    hook(bot) {
        bot.on("channelUpdate", function(channel) {
            try {
                if(bot.isDatabaseReady === false || channel == null || channel.type === "dm") {
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