module.exports = {
    async removeServerWarningsFromUser(global_context, server, user) {
        var query = "DELETE FROM serverwarnings WHERE serverID='" + server.id + "' AND userID='" + user.id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async removeServerMute(global_context, id) {
        var query = "DELETE FROM servermutes WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async removeServerBan(global_context, id) {
        var query = "DELETE FROM serverbans WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async removeRank(global_context, id) {
        var query = "DELETE FROM ranks WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async removeRanksFromServer(global_context, id) {
        var query = "DELETE FROM ranks WHERE serverID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async removeReactionRolesFromServer(global_context, id) {
        var query = "DELETE FROM reactionroles WHERE serverID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    }
}