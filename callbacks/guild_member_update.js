module.exports = {
    hook(global_context) {
        global_context.bot.on("guildMemberUpdate", async(oldMember, newMember) => {
            try {
                if(bot.isDatabaseReady === false || oldMember == null || newMember == null) {
                    return;
                }

                if(oldMember.nickname != newMember.nickname) {
                    bot.emit("guildMemberNicknameChange", oldMember, newMember);
                }
            } catch(e) {
                console.error(e);
            }
        });
    }
}