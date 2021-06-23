module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberUpdate", async(oldMember, newMember) => {
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;

            if(oldMember.nickname != newMember.nickname) {
                bot.emit("guildMemberNicknameChange", oldMember, newMember);
            }
        });
    }
}