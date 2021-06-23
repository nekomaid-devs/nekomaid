module.exports = {
    async addServer(ssm, server) {
        var query = "INSERT IGNORE INTO servers (serverID, autoRoles, module_level_ignoredChannels, bannedWords) VALUES('" + server.id + "', '', '', '')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addServerBan(ssm, ban) {
        var query = "INSERT IGNORE INTO serverbans (id, serverID, userID, start, end, reason) VALUES('" + ban.id + "', '" + ban.serverID + "', '" + ban.userID + "', " + ban.start + ", " + ban.end + ", '" + ban.reason + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addServerMute(ssm, mute) {
        var query = "INSERT IGNORE INTO servermutes (id, serverID, userID, start, end, reason) VALUES('" + mute.id + "', '" + mute.serverID + "', '" + mute.userID + "', " + mute.start + ", " + mute.end + ", '" + mute.reason + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addServerWarning(ssm, warning) {
        var query = "INSERT IGNORE INTO serverwarnings (id, serverID, userID, start, reason) VALUES('" + warning.id + "', '" + warning.serverID + "', '" + warning.userID + "', " + warning.start + ", '" + warning.reason + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addServerUser(ssm, server, user) {
        var fastFindID = server.id + "-" + user.id;
        var query = "INSERT IGNORE INTO serverusers (fastFindID, serverID, userID) VALUES('" + fastFindID + "', '" + server.id + "', '" + user.id + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addGlobalUser(ssm, user) {
        var query = "INSERT IGNORE INTO globalusers (userID, inventory) VALUES('" + user.id + "', '')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addCounter(ssm, counter) {
        var query = "INSERT IGNORE INTO counters (id, serverID, channelID, type, lastUpdate) VALUES('" + counter.id + "', '" + counter.serverID + "', '" + counter.channelID + "', '" + counter.type + "', '" + counter.lastUpdate + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addRank(ssm, rank) {
        var query = "INSERT IGNORE INTO ranks (id, serverID, roleID, level, name) VALUES('" + rank.id + "', '" + rank.serverID + "', '" + rank.roleID + "', " + rank.level + ", '" + rank.name + "')";
        return await ssm.sqlConn.promise().query(query);
    },

    async addReactionRole(ssm, rr) {
        var query = "INSERT IGNORE INTO reactionroles (id, serverID, channelID, messageID, reactionRoles, reactionRoleEmojis) VALUES('" + rr.id + "', '" + rr.serverID + "', '" + rr.channelID + "', '" + rr.messageID + "', '" + rr.reactionRoles.join(",") + "', '" + rr.reactionRoleEmojis.join(",") + "')";
        return await ssm.sqlConn.promise().query(query);
    }
}