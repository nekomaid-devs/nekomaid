module.exports = {
    async add_server(global_context, server) {
        var query = "INSERT IGNORE INTO servers (server_ID, auto_roles, module_level_ignored_channels, banned_words) VALUES('" + server.id + "', '', '', '')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_ban(global_context, ban) {
        var query = "INSERT IGNORE INTO server_bans (id, server_ID, user_ID, start, end, reason) VALUES('" + ban.id + "', '" + ban.server_ID + "', '" + ban.user_ID + "', " + ban.start + ", " + ban.end + ", '" + ban.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_mute(global_context, mute) {
        var query = "INSERT IGNORE INTO server_mutes (id, server_ID, user_ID, start, end, reason) VALUES('" + mute.id + "', '" + mute.server_ID + "', '" + mute.user_ID + "', " + mute.start + ", " + mute.end + ", '" + mute.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_warning(global_context, warning) {
        var query = "INSERT IGNORE INTO server_warnings (id, server_ID, user_ID, start, reason) VALUES('" + warning.id + "', '" + warning.server_ID + "', '" + warning.user_ID + "', " + warning.start + ", '" + warning.reason + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_server_user(global_context, server, user) {
        var fast_find_ID = server.id + "-" + user.id;
        var query = "INSERT IGNORE INTO server_users (fast_find_ID, server_ID, user_ID) VALUES('" + fast_find_ID + "', '" + server.id + "', '" + user.id + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_global_user(global_context, user) {
        var query = "INSERT IGNORE INTO global_users (user_ID, inventory) VALUES('" + user.id + "', '')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_counter(global_context, counter) {
        var query = "INSERT IGNORE INTO server_counters (id, server_ID, channel_ID, type, last_update) VALUES('" + counter.id + "', '" + counter.server_ID + "', '" + counter.channel_ID + "', '" + counter.type + "', '" + counter.last_update + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_rank(global_context, rank) {
        var query = "INSERT IGNORE INTO server_ranks (id, server_ID, role_ID, level, name) VALUES('" + rank.id + "', '" + rank.server_ID + "', '" + rank.role_ID + "', " + rank.level + ", '" + rank.name + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_reaction_role(global_context, rr) {
        var query = "INSERT IGNORE INTO server_reaction_roles (id, server_ID, channel_ID, message_ID, reaction_roles, reaction_role_emojis) VALUES('" + rr.id + "', '" + rr.server_ID + "', '" + rr.channel_ID + "', '" + rr.message_ID + "', '" + rr.reaction_roles.join(",") + "', '" + rr.reaction_role_emojis.join(",") + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_inventory_item(global_context, i) {
        var query = "INSERT IGNORE INTO inventory_items (id, user_ID, item_ID) VALUES('" + i.id + "', '" + i.user_ID + "', '" + i.item_ID + "')";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query);
    },

    async add_user_notification(global_context, n) {
        let query_0 = "id, user_ID, timestamp, description"
        let query_data = [ n.id, n.user_ID, n.timestamp, n.description ]
        let query = "INSERT IGNORE INTO user_notifications (" + query_0 + ") VALUES(?, ?, ?, ?)";
        return await global_context.neko_modules_clients.ssm.sql_connection.promise().query(query, query_data);
    }
}