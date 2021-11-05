/* Types */
import { fetch_data, fetch_multiple_data, GuildFetchType, guild_fetch_type_to_selector } from "./db_utils";

/* Node Imports */
import { Connection } from "mysql2/promise";

/* Local Imports */
import { _add_global_user, _add_server, _add_server_user } from "./db_add";

export async function _fetch_config(connection: Connection, id: string) {
    return await fetch_data(connection, "SELECT * FROM configs WHERE id=?", [id], format_config, () => {
        return;
    });
}

async function format_config(config: any) {
    config.bot_owners = config.bot_owners.split(",").filter((e: string) => e.length > 0);
    config.beg_success_answers = config.beg_success_answers.split(",").filter((e: string) => e.length > 0);
    config.beg_failed_answers = config.beg_failed_answers.split(",").filter((e: string) => e.length > 0);
    config.work_answers = config.work_answers.split("\r\n").filter((e: string) => e.length > 0);
    config.crime_success_answers = config.crime_success_answers.split("\r\n").filter((e: string) => e.length > 0);
    config.crime_failed_answers = config.crime_failed_answers.split("\r\n").filter((e: string) => e.length > 0);

    return config;
}

export async function _fetch_server(connection: Connection, id: string, type: GuildFetchType, contains_extra: boolean, contains_ranks: boolean) {
    return await fetch_data(
        connection,
        `SELECT ${guild_fetch_type_to_selector(type)} FROM servers WHERE server_ID=?`,
        [id],
        async (e: any) => {
            return await format_server(connection, e, contains_extra, contains_ranks);
        },
        async () => {
            return await _add_server(connection, id);
        }
    );
}

async function format_server(connection: Connection, server: any, contains_extra: boolean, contains_ranks: boolean) {
    server.banned_words = server.banned_words == null ? server.banned_words : server.banned_words.split(",").filter((e: string) => e.length > 0);
    server.auto_roles = server.auto_roles == null ? server.auto_roles : server.auto_roles.split(",").filter((e: string) => e.length > 0);
    server.module_level_ignored_channels = server.module_level_ignored_channels == null ? server.module_level_ignored_channels : server.module_level_ignored_channels.split(",").filter((e: string) => e.length > 0);
    if (contains_extra === true) {
        server.counters = await _fetch_server_counters(connection, server.server_ID);
        server.reaction_roles = await _fetch_server_reaction_roles(connection, server.server_ID);
    }
    if (contains_extra === true || contains_ranks === true) {
        server.module_level_ranks = await _fetch_server_ranks(connection, server.server_ID);
    }

    return server;
}

export async function _fetch_server_bans(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_bans WHERE server_ID=?", [id], null);
}

export async function _fetch_all_expired_bans(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_bans WHERE end <> -1 AND end < ?", [Date.now()], null);
}

export async function _fetch_server_mutes(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_mutes WHERE server_ID=?", [id], null);
}

export async function _fetch_all_expired_mutes(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_mutes WHERE end <> -1 AND end < ?", [Date.now()], null);
}

export async function _fetch_server_warnings(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_warnings WHERE server_ID=?", [id], null);
}

export async function _fetch_server_counters(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_counters WHERE server_ID=?", [id], null);
}

export async function _fetch_all_counters(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_counters", [], null);
}

export async function _fetch_server_reaction_roles(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_reaction_roles WHERE server_ID=?", [id], format_reaction_role);
}

export async function _fetch_all_reaction_roles(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_reaction_roles", [], format_reaction_role);
}

async function format_reaction_role(rr: any) {
    rr.reaction_roles = rr.reaction_roles.split(",").filter((e: string) => e.length > 0);
    rr.reaction_role_emojis = rr.reaction_role_emojis.split(",").filter((e: string) => e.length > 0);

    return rr;
}

export async function _fetch_server_ranks(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_ranks WHERE server_ID=?", [id], null);
}

export async function _fetch_server_user(connection: Connection, server_ID: string, user_ID: string) {
    return await fetch_data(connection, "SELECT * FROM server_users WHERE fast_find_ID=?", [`${server_ID}-${user_ID}`], null, async () => {
        return await _add_server_user(connection, server_ID, user_ID);
    });
}

export async function _fetch_server_users(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM server_users WHERE server_ID=?", [id], null);
}

export async function _fetch_global_user(connection: Connection, id: string, contains_inventory: boolean, contains_notifications: boolean) {
    return await fetch_data(
        connection,
        "SELECT * FROM global_users WHERE user_ID=?",
        [id],
        async (e: any) => {
            return await format_global_user(connection, e, contains_inventory, contains_notifications);
        },
        async () => {
            return await _add_global_user(connection, id);
        }
    );
}

export async function _fetch_all_global_users(connection: Connection, contains_inventory: boolean, contains_notifications: boolean) {
    return await fetch_multiple_data(connection, "SELECT * FROM global_users", [], async (e: any) => {
        return await format_global_user(connection, e, contains_inventory, contains_notifications);
    });
}

export async function _fetch_all_global_users_with_buildings(connection: Connection, contains_inventory: boolean, contains_notifications: boolean) {
    return await fetch_multiple_data(connection, "SELECT * FROM global_users WHERE b_lewd_services > 0 AND b_casino > 0 AND b_scrapyard > 0 AND b_pawn_shop > 0", [], async (e: any) => {
        return await format_global_user(connection, e, contains_inventory, contains_notifications);
    });
}

async function format_global_user(connection: Connection, user: any, contains_inventory: boolean, contains_notifications: boolean) {
    if (contains_inventory === true) {
        user.inventory = await _fetch_user_inventory_items(connection, user.user_ID);
    }
    if (contains_notifications === true) {
        user.notifications = await _fetch_user_notifications(connection, user.user_ID);
    }
    user.bank_limit = [0, 10000, 15000, 20000, 30000, 45000, 60000, 75000, 10000, 200000, 350000][user.b_bank];

    return user;
}

export async function _fetch_user_inventory_items(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT FROM inventory_items WHERE user_ID=?", [id], null);
}

export async function _fetch_user_notifications(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT FROM user_notifications WHERE user_ID=?", [id], null);
}
