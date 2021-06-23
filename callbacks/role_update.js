module.exports = {
    hook(global_context) {
        global_context.bot.on("roleUpdate", async(role) => {
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