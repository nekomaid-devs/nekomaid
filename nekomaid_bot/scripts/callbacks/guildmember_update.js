module.exports = {
    hook(bot) {
        bot.on('guildMemberUpdate', function(oldMember, newMember) {
            try {
                if(bot.isDatabaseReady === false || oldMember == null || newMember == null) {
                    return;
                }

                if(oldMember.nickname != newMember.nickname) {
                    bot.emit("nicknameChange", oldMember, newMember);
                }
            } catch(e) {
                console.error(e);
            }
        });
    }
}