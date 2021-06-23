module.exports = {
    hook(bot) {
        bot.on("roleCreate", function(role) {
            try {
                if(bot.isDatabaseReady === false) {
                    return;
                }

                bot.totalEvents += 1;
                bot.processedEvents += 1;
            } catch(e) {
                console.error(e);
            }
        })
    }
}