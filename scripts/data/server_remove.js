module.exports = {
    async remove_server_warnings_from_user(global_context, server, user) {
        var query = "DELETE FROM serverwarnings WHERE serverID='" + server.id + "' AND userID='" + user.id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_server_mute(global_context, id) {
        var query = "DELETE FROM servermutes WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_server_ban(global_context, id) {
        var query = "DELETE FROM serverbans WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_rank(global_context, id) {
        var query = "DELETE FROM ranks WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_ranks_from_server(global_context, id) {
        var query = "DELETE FROM ranks WHERE serverID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_reaction_roles_from_server(global_context, id) {
        var query = "DELETE FROM reactionroles WHERE serverID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    }
}