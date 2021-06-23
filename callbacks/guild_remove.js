module.exports = {
    hook(global_context) {
        global_context.bot.on("guildDelete", async(guild) => {
            global_context.logger.log("Removed from a Guild~ [Name: " + guild.name + "] - [ID: " + guild.id + "] - [Members: " + guild.memberCount + "]");
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    }
}