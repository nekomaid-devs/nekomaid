/* Types */
import { ServerBanData, ServerMuteData, ServerWarnData, CounterData, RankData, ReactionRoleData, NotificationData, UserItemData } from "../../ts/base";

/* Node Imports */
import { Connection } from "mysql2/promise";

export async function _add_server(connection: Connection, id: string) {
    const query = "INSERT IGNORE INTO servers (server_ID, banned_words, auto_roles, module_level_ignored_channels) VALUES(?, '', '', '')";
    const queryData = [id];
    return await connection.execute(query, queryData);
}

export async function _add_server_ban(connection: Connection, item: ServerBanData) {
    const query = "INSERT IGNORE INTO server_bans (id, server_ID, user_ID, start, end, reason) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.user_ID, item.start, item.end, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_server_mute(connection: Connection, item: ServerMuteData) {
    const query = "INSERT IGNORE INTO server_mutes (id, server_ID, user_ID, start, end, reason) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.user_ID, item.start, item.end, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_server_warning(connection: Connection, item: ServerWarnData) {
    const query = "INSERT IGNORE INTO server_warnings (id, server_ID, user_ID, start, reason) VALUES(?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.user_ID, item.start, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_server_user(connection: Connection, server_ID: string, user_ID: string) {
    const query = "INSERT IGNORE INTO server_users (fast_find_ID, server_ID, user_ID) VALUES(?, ?, ?)";
    const query_data = [`${server_ID}-${user_ID}`, server_ID, user_ID];
    return await connection.execute(query, query_data);
}

export async function _add_global_user(connection: Connection, id: string) {
    const query = "INSERT IGNORE INTO global_users (user_ID, inventory) VALUES(?, '')";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _add_counter(connection: Connection, item: CounterData) {
    const query = "INSERT IGNORE INTO server_counters (id, server_ID, channel_ID, type, last_update) VALUES(?, ?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.channel_ID, item.type, item.last_update];
    return await connection.execute(query, query_data);
}

export async function _add_rank(connection: Connection, item: RankData) {
    const query = "INSERT IGNORE INTO server_ranks (id, server_ID, role_ID, level, name) VALUES(?, ?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.role_ID, item.level, item.name];
    return await connection.execute(query, query_data);
}

export async function _add_reaction_role(connection: Connection, item: ReactionRoleData) {
    const query = "INSERT IGNORE INTO server_reaction_roles (id, server_ID, channel_ID, message_ID, reaction_roles, reaction_role_emojis) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.server_ID, item.channel_ID, item.message_ID, item.reaction_roles.join(","), item.reaction_role_emojis.join(",")];
    return await connection.execute(query, query_data);
}

export async function _add_inventory_item(connection: Connection, item: UserItemData) {
    const query = "INSERT IGNORE INTO inventory_items (id, user_ID, item_ID) VALUES(?, ?, ?)";
    const query_data = [item.id];
    return await connection.execute(query, query_data);
}

export async function _add_user_notification(connection: Connection, item: NotificationData) {
    const query = "INSERT IGNORE INTO user_notifications (id, user_ID, timestamp, description) VALUES(?, ?, ?, ?)";
    const query_data = [item.id, item.user_ID, item.timestamp, item.description];
    return await connection.execute(query, query_data);
}
