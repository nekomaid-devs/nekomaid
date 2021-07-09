module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberUpdate", async(old_member, new_member) => {
            try {
                await this.process(global_context, old_member, new_member);
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

    async process(global_context, old_member, new_member) {
        if(old_member == null) { return; }
        if(old_member.nickname !== new_member.nickname) {
            global_context.bot.emit("guildMemberNicknameChange", old_member, new_member);
        }
    }
}