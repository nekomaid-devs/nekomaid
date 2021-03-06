/* Node Imports */
import { Connection } from "mysql2/promise";

export async function _remove_guild_ban(connection: Connection, id: string) {
    const query = "DELETE FROM guild_bans WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_guild_mute(connection: Connection, id: string) {
    const query = "DELETE FROM guild_mutes WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_guild_warnings_from_user(connection: Connection, guild_ID: string, user_ID: string) {
    const query = "DELETE FROM guild_warnings WHERE guild_ID=? AND user_ID=?";
    const query_data = [guild_ID, user_ID];
    return await connection.execute(query, query_data);
}

export async function _remove_guild_rank(connection: Connection, id: string) {
    const query = "DELETE FROM guild_ranks WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_inventory_item(connection: Connection, id: string) {
    const query = "DELETE FROM inventory_items WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}
