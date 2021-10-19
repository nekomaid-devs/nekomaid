module.exports = {
    async remove_server_warnings_from_user(global_context, server, user) {
        let query = "DELETE FROM server_warnings WHERE server_ID='" + server.id + "' AND user_ID='" + user.id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_server_mute(global_context, id) {
        let query = "DELETE FROM server_mutes WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_server_ban(global_context, id) {
        let query = "DELETE FROM server_bans WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_rank(global_context, id) {
        let query = "DELETE FROM server_ranks WHERE id='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_counters_from_server(global_context, id) {
        let query = "DELETE FROM server_counters WHERE server_ID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_ranks_from_server(global_context, id) {
        let query = "DELETE FROM server_ranks WHERE server_ID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_reaction_roles_from_server(global_context, id) {
        let query = "DELETE FROM server_reaction_roles WHERE server_ID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_inventory_items_from_user(global_context, id) {
        let query = "DELETE FROM inventory_items WHERE user_ID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async remove_user_notification_from_user(global_context, id) {
        let query = "DELETE FROM user_notifications WHERE user_ID='" + id + "'";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },
};
