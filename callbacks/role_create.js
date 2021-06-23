module.exports = {
    hook(global_context) {
        global_context.bot.on("roleCreate", async(role) => {
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
        });
    }
}