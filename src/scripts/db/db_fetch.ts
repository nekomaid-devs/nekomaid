/* Types */
import { GuildFetchFlags, ConfigFetchFlags, GuildFetchType, UserFetchFlags } from "../../ts/mysql";

/* Node Imports */
import { Connection } from "mysql2/promise";

/* Local Imports */
import { fetch_data, fetch_multiple_data, guild_fetch_type_to_selector } from "../utils/mysql";
import { _add_user, _add_guild, _add_guild_user } from "./db_add";
import { get_time_difference } from "../utils/time";

export async function _fetch_config(connection: Connection, id: string, flags: number) {
    return await fetch_data(
        connection,
        "SELECT * FROM configs WHERE id=?",
        [id],
        async (e: any) => {
            return await format_config(connection, e, flags);
        },
        () => {
            return;
        }
    );
}

async function format_config(connection: Connection, item: any, flags: number) {
    item.bot_owners = item.bot_owners.split(",").filter((e: string) => {
        return e.length > 0;
    });
    item.beg_success_answers = item.beg_success_answers.split(",").filter((e: string) => {
        return e.length > 0;
    });
    item.beg_failed_answers = item.beg_failed_answers.split(",").filter((e: string) => {
        return e.length > 0;
    });
    item.work_answers = item.work_answers.split("\r\n").filter((e: string) => {
        return e.length > 0;
    });
    item.crime_success_answers = item.crime_success_answers.split("\r\n").filter((e: string) => {
        return e.length > 0;
    });
    item.crime_failed_answers = item.crime_failed_answers.split("\r\n").filter((e: string) => {
        return e.length > 0;
    });
    if (flags & ConfigFetchFlags.ITEMS) {
        item.items = await _fetch_all_items(connection);
    }

    return item;
}

export async function _fetch_all_items(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM items", [], format_item);
}

function format_item(item: any) {
    item.data = JSON.parse(item.data);

    return item;
}

export async function _fetch_guild(connection: Connection, id: string, type: GuildFetchType, flags: number) {
    return await fetch_data(
        connection,
        `SELECT ${guild_fetch_type_to_selector(type)} FROM guilds WHERE id=?`,
        [id],
        async (e: any) => {
            return await format_guild(connection, e, flags);
        },
        async () => {
            return await _add_guild(connection, id);
        }
    );
}

async function format_guild(connection: Connection, item: any, flags: number) {
    item.banned_words =
        item.banned_words === null
            ? item.banned_words
            : item.banned_words.split(",").filter((e: string) => {
                  return e.length > 0;
              });
    item.auto_roles =
        item.auto_roles === null
            ? item.auto_roles
            : item.auto_roles.split(",").filter((e: string) => {
                  return e.length > 0;
              });
    item.module_level_ignored_channels =
        item.module_level_ignored_channels === null
            ? item.module_level_ignored_channels
            : item.module_level_ignored_channels.split(",").filter((e: string) => {
                  return e.length > 0;
              });
    if (flags & GuildFetchFlags.COUNTERS) {
        item.counters = await _fetch_guild_counters(connection, item.id);
    }
    if (flags & GuildFetchFlags.REACTION_ROLES) {
        item.reaction_roles = await _fetch_guild_reaction_roles(connection, item.id);
    }
    if (flags & GuildFetchFlags.RANKS) {
        item.module_level_ranks = await _fetch_guild_ranks(connection, item.id);
    }

    return item;
}

export async function _fetch_guild_bans(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_bans WHERE id=?", [id], null);
}

export async function _fetch_all_expired_bans(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_bans WHERE end <> NULL AND end < ?", [Date.now()], null);
}

export async function _fetch_guild_mutes(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_mutes WHERE id=?", [id], null);
}

export async function _fetch_all_expired_mutes(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_mutes WHERE end <> NULL AND end < ?", [Date.now()], null);
}

export async function _fetch_guild_warnings(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_warnings WHERE id=?", [id], null);
}

export async function _fetch_guild_counters(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_counters WHERE id=?", [id], null);
}

export async function _fetch_all_counters(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_counters", [], null);
}

export async function _fetch_guild_reaction_roles(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_reaction_roles WHERE id=?", [id], format_guild_reaction_role);
}

export async function _fetch_all_reaction_roles(connection: Connection) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_reaction_roles", [], format_guild_reaction_role);
}

function format_guild_reaction_role(item: any) {
    item.reaction_roles = item.reaction_roles.split(",").filter((e: string) => {
        return e.length > 0;
    });
    item.reaction_role_emojis = item.reaction_role_emojis.split(",").filter((e: string) => {
        return e.length > 0;
    });

    return item;
}

export async function _fetch_guild_ranks(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_ranks WHERE id=?", [id], null);
}

export async function _fetch_guild_user(connection: Connection, guild_ID: string, user_ID: string) {
    return await fetch_data(connection, "SELECT * FROM guild_users WHERE fast_find_ID=?", [`${guild_ID}-${user_ID}`], null, async () => {
        return await _add_guild_user(connection, guild_ID, user_ID);
    });
}

export async function _fetch_guild_users(connection: Connection, id: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM guild_users WHERE id=?", [id], null);
}

export async function _fetch_user(connection: Connection, id: string, flags: number) {
    return await fetch_data(
        connection,
        "SELECT * FROM users WHERE id=?",
        [id],
        async (e: any) => {
            return await format_user(connection, e, flags);
        },
        async () => {
            return await _add_user(connection, id);
        }
    );
}

export async function _fetch_all_users(connection: Connection, flags: number) {
    return await fetch_multiple_data(connection, "SELECT * FROM users", [], async (e: any) => {
        return await format_user(connection, e, flags);
    });
}

export async function _fetch_all_users_with_buildings(connection: Connection, flags: number) {
    return await fetch_multiple_data(connection, "SELECT * FROM users WHERE b_lewd_services > 0 AND b_casino > 0 AND b_scrapyard > 0 AND b_pawn_shop > 0", [], async (e: any) => {
        return await format_user(connection, e, flags);
    });
}

async function format_user(connection: Connection, item: any, flags: number) {
    if (flags & UserFetchFlags.INVENTORY) {
        item.inventory = await _fetch_inventory_items(connection, item.id);
    }
    if (flags & UserFetchFlags.NOTIFICATIONS) {
        item.notifications = await _fetch_notifications(connection, item.id);
    }

    const diff = get_time_difference(item.last_upvoted_time, 60 * 24, 1);
    item.premium = diff.diff < 60 * 24;

    return item;
}

export async function _fetch_inventory_items(connection: Connection, user_ID: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM inventory_items WHERE user_ID=?", [user_ID], null);
}

export async function _fetch_notifications(connection: Connection, user_ID: string) {
    return await fetch_multiple_data(connection, "SELECT * FROM notifications WHERE user_ID=?", [user_ID], null);
}
