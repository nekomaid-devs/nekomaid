module.exports = {
    async add_server(global_context, server) {
        var query = "INSERT IGNORE INTO servers (serverID, autoRoles, module_level_ignoredChannels, bannedWords) VALUES('" + server.id + "', '', '', '')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_ban(global_context, ban) {
        var query = "INSERT IGNORE INTO serverbans (id, serverID, userID, start, end, reason) VALUES('" + ban.id + "', '" + ban.serverID + "', '" + ban.userID + "', " + ban.start + ", " + ban.end + ", '" + ban.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_mute(global_context, mute) {
        var query = "INSERT IGNORE INTO servermutes (id, serverID, userID, start, end, reason) VALUES('" + mute.id + "', '" + mute.serverID + "', '" + mute.userID + "', " + mute.start + ", " + mute.end + ", '" + mute.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_warning(global_context, warning) {
        var query = "INSERT IGNORE INTO serverwarnings (id, serverID, userID, start, reason) VALUES('" + warning.id + "', '" + warning.serverID + "', '" + warning.userID + "', " + warning.start + ", '" + warning.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_user(global_context, server, user) {
        var fastFindID = server.id + "-" + user.id;
        var query = "INSERT IGNORE INTO serverusers (fastFindID, serverID, userID) VALUES('" + fastFindID + "', '" + server.id + "', '" + user.id + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_global_user(global_context, user) {
        var query = "INSERT IGNORE INTO globalusers (userID, inventory) VALUES('" + user.id + "', '')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_counter(global_context, counter) {
        var query = "INSERT IGNORE INTO counters (id, serverID, channelID, type, lastUpdate) VALUES('" + counter.id + "', '" + counter.serverID + "', '" + counter.channelID + "', '" + counter.type + "', '" + counter.lastUpdate + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_rank(global_context, rank) {
        var query = "INSERT IGNORE INTO ranks (id, serverID, roleID, level, name) VALUES('" + rank.id + "', '" + rank.serverID + "', '" + rank.roleID + "', " + rank.level + ", '" + rank.name + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_reaction_role(global_context, rr) {
        var query = "INSERT IGNORE INTO reactionroles (id, serverID, channelID, messageID, reactionRoles, reactionRoleEmojis) VALUES('" + rr.id + "', '" + rr.serverID + "', '" + rr.channelID + "', '" + rr.messageID + "', '" + rr.reactionRoles.join(",") + "', '" + rr.reactionRoleEmojis.join(",") + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    }
}