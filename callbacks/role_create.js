module.exports = {
    hook(global_context) {
        global_context.bot.on("roleCreate", async(role) => {
            try {
                await this.process(global_context, role);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    },

    async process(global_context, role) {

    }
}