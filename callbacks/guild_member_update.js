module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberUpdate", async(oldMember, newMember) => {
            try {
                await this.process(global_context, oldMember, newMember);
            } catch(e) {
                if(global_context.config.sentry_enabled === true) {
                    global_context.modules.Sentry.captureException(e);
                }
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, oldMember, newMember) {
        if(oldMember == null) { return; }
        if(oldMember.nickname !== newMember.nickname) {
            global_context.bot.emit("guildMemberNicknameChange", oldMember, newMember);
        }
    }
}