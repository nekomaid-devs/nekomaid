/* Types */
import { GlobalContext } from "../../ts/base";
import { Guild, User } from "discord.js";

export async function remove_server_warnings_from_user(global_context: GlobalContext, server: Guild, user: User) {
    const query = "DELETE FROM server_warnings WHERE server_ID='" + server.id + "' AND user_ID='" + user.id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_server_mute(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_mutes WHERE id='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_server_ban(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_bans WHERE id='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_rank(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_ranks WHERE id='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_counters_from_server(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_counters WHERE server_ID='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_ranks_from_server(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_ranks WHERE server_ID='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_reaction_roles_from_server(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM server_reaction_roles WHERE server_ID='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_inventory_items_from_user(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM inventory_items WHERE user_ID='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}

export async function remove_user_notification_from_user(global_context: GlobalContext, id: string) {
    const query = "DELETE FROM user_notifications WHERE user_ID='" + id + "'";
    return await global_context.neko_modules_clients.mySQL.sql_connection.promise().query(query);
}
