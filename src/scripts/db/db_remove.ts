/* Types */
import { Guild, User } from "discord.js";

/* Node Imports */
import { Connection } from "mysql2/promise";

export async function _remove_server_ban(connection: Connection, id: string) {
    const query = "DELETE FROM server_bans WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_server_mute(connection: Connection, id: string) {
    const query = "DELETE FROM server_mutes WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_server_warnings_from_user(connection: Connection, server_ID: string, user_ID: string) {
    const query = "DELETE FROM server_warnings WHERE server_ID=? AND user_ID=?";
    const query_data = [server_ID, user_ID];
    return await connection.execute(query, query_data);
}

export async function _remove_rank(connection: Connection, id: string) {
    const query = "DELETE FROM server_ranks WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}

export async function _remove_inventory_item(connection: Connection, id: string) {
    const query = "DELETE FROM inventory_items WHERE id=?";
    const query_data = [id];
    return await connection.execute(query, query_data);
}
