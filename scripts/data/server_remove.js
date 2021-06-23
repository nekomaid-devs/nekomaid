module.exports = {
    async removeServerWarningsFromUser(ssm, server, user) {
        var query = "DELETE FROM serverwarnings WHERE serverID='" + server.id + "' AND userID='" + user.id + "'";
        return await ssm.sqlConn.promise().query(query);
    },

    async removeServerMute(ssm, id) {
        var query = "DELETE FROM servermutes WHERE id='" + id + "'";
        return await ssm.sqlConn.promise().query(query);
    },

    async removeServerBan(ssm, id) {
        var query = "DELETE FROM serverbans WHERE id='" + id + "'";
        return await ssm.sqlConn.promise().query(query);
    },

    async removeRank(ssm, id) {
        var query = "DELETE FROM ranks WHERE id='" + id + "'";
        return await ssm.sqlConn.promise().query(query);
    },

    async removeRanksFromServer(ssm, id) {
        var query = "DELETE FROM ranks WHERE serverID='" + id + "'";
        return await ssm.sqlConn.promise().query(query);
    },

    async removeReactionRolesFromServer(ssm, id) {
        var query = "DELETE FROM reactionroles WHERE serverID='" + id + "'";
        return await ssm.sqlConn.promise().query(query);
    }
}