module.exports = {
    hook(bot) {
        bot.on('guildDelete', function(guild) {
            try {
                if(bot.isDatabaseReady === false) { 
                    return; 
                }
            
                console.log("- Removed from Guild(name: " + guild.name + ", id: " + guild.id + ", members: " + guild.memberCount + ")");
                console.log(">");
                
                bot.totalEvents += 1;
                bot.processedEvents += 1;
            } catch(e) {
                console.error(e);
            }
        });
    }
}