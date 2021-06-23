module.exports = {
    hook(global_context) {
        global_context.bot.on("guildCreate", async(guild) => {
            try {
                if(bot.isDatabaseReady === false) { 
                    return; 
                }
            
                console.log("- Added to new Guild(name: " + guild.name + ", id: " + guild.id + ", members: " + guild.memberCount + ")");
                console.log(">");
                
                bot.totalEvents += 1;
                bot.processedEvents += 1;
                bot.moderator.checkChannels(bot.moderator, guild);
            } catch(e) {
                console.error(e);
            }
        });
    }
}