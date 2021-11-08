/* Types */
import { GuildBanData, GuildMuteData, GuildWarnData, CounterData, RankData, ReactionRoleData, NotificationData, UserItemData } from "../../ts/base";

/* Node Imports */
import { Connection } from "mysql2/promise";

export async function _add_guild(connection: Connection, id: string) {
    const query = "INSERT IGNORE INTO guilds (id, banned_words, auto_roles, module_level_ignored_channels) VALUES(?, '', '', '')";
    const queryData = [id];
    return await connection.execute(query, queryData);
}

export async function _add_guild_ban(connection: Connection, item: GuildBanData) {
    const query = "INSERT IGNORE INTO guild_bans (id, guild_ID, user_ID, start, end, reason) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.user_ID, item.start, item.end, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_guild_mute(connection: Connection, item: GuildMuteData) {
    const query = "INSERT IGNORE INTO guild_mutes (id, guild_ID, user_ID, start, end, reason) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.user_ID, item.start, item.end, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_guild_warning(connection: Connection, item: GuildWarnData) {
    const query = "INSERT IGNORE INTO guild_warnings (id, guild_ID, user_ID, start, reason) VALUES(?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.user_ID, item.start, item.reason];
    return await connection.execute(query, query_data);
}

export async function _add_guild_user(connection: Connection, guild_ID: string, user_ID: string) {
    const query = "INSERT IGNORE INTO guild_users (fast_find_ID, guild_ID, user_ID) VALUES(?, ?, ?)";
    const query_data = [`${guild_ID}-${user_ID}`, guild_ID, user_ID];
    return await connection.execute(query, query_data);
}

export async function _add_guild_counter(connection: Connection, item: CounterData) {
    const query = "INSERT IGNORE INTO guild_counters (id, guild_ID, channel_ID, type, last_update) VALUES(?, ?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.channel_ID, item.type, item.last_update];
    return await connection.execute(query, query_data);
}

export async function _add_guild_rank(connection: Connection, item: RankData) {
    const query = "INSERT IGNORE INTO guild_ranks (id, guild_ID, role_ID, level, name) VALUES(?, ?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.role_ID, item.level, item.name];
    return await connection.execute(query, query_data);
}

export async function _add_guild_reaction_role(connection: Connection, item: ReactionRoleData) {
    const query = "INSERT IGNORE INTO guild_reaction_roles (id, guild_ID, channel_ID, message_ID, reaction_roles, reaction_role_emojis) VALUES(?, ?, ?, ?, ?, ?)";
    const query_data = [item.id, item.guild_ID, item.channel_ID, item.message_ID, item.reaction_roles.join(","), item.reaction_role_emojis.join(",")];
    return await connection.execute(query, query_data);
}

export async function _add_user(connection: Connection, id: string) {
    const query = "INSERT IGNORE INTO users (id, inventory) VALUES(?, '')";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _add_inventory_item(connection: Connection, item: UserItemData) {
    const query = "INSERT IGNORE INTO inventory_items (id, user_ID, item_ID) VALUES(?, ?, ?)";
    const query_data = [item.id];
    return await connection.execute(query, query_data);
}

export async function _add_notification(connection: Connection, item: NotificationData) {
    const query = "INSERT IGNORE INTO notifications (id, user_ID, timestamp, description) VALUES(?, ?, ?, ?)";
    const query_data = [item.id, item.user_ID, item.timestamp, item.description];
    return await connection.execute(query, query_data);
}
