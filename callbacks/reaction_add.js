module.exports = {
    hook(global_context) {
        global_context.bot.on("messageReactionAdd", async(reaction) => {
            try {
                if(bot.isDatabaseReady === false || reaction.message.channel.type === "dm" || reaction.message.channel.guild.id !== "717795656101527604") {
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