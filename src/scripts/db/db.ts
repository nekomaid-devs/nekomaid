/* Node Imports */
import { BotData, CounterData, GlobalUserData, GuildData, NotificationData, RankData, ReactionRoleData, ServerBanData, ServerMuteData, ServerUserData, ServerWarnData, UserItemData } from "../../ts/base";
import { GuildEditType, GuildFetchType } from "./db_utils";
import { Connection } from "mysql2/promise";

/* Local Imports */
import { _add_counter, _add_global_user, _add_inventory_item, _add_rank, _add_reaction_role, _add_server, _add_server_ban, _add_server_mute, _add_server_user, _add_server_warning, _add_user_notification } from "./db_add";
import { _edit_config, _edit_counter, _edit_global_user, _edit_server, _edit_server_user } from "./db_edit";
import {
    _fetch_all_counters,
    _fetch_all_expired_bans,
    _fetch_all_expired_mutes,
    _fetch_all_global_users,
    _fetch_all_global_users_with_buildings,
    _fetch_all_reaction_roles,
    _fetch_config,
    _fetch_global_user,
    _fetch_server,
    _fetch_server_bans,
    _fetch_server_counters,
    _fetch_server_mutes,
    _fetch_server_ranks,
    _fetch_server_reaction_roles,
    _fetch_server_user,
    _fetch_server_users,
    _fetch_server_warnings,
    _fetch_user_inventory_items,
    _fetch_user_notifications,
} from "./db_fetch";
import { _remove_inventory_item, _remove_rank, _remove_server_ban, _remove_server_mute, _remove_server_warnings_from_user } from "./db_remove";

class Database {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async add_server(id: string) {
        return await _add_server(this.connection, id);
    }

    async add_server_ban(item: ServerBanData) {
        return await _add_server_ban(this.connection, item);
    }

    async add_server_mute(item: ServerMuteData) {
        return await _add_server_mute(this.connection, item);
    }

    async add_server_warning(item: ServerWarnData) {
        return await _add_server_warning(this.connection, item);
    }

    async add_server_user(server_ID: string, user_ID: string) {
        return await _add_server_user(this.connection, server_ID, user_ID);
    }

    async add_global_user(id: string) {
        return await _add_global_user(this.connection, id);
    }

    async add_counter(item: CounterData) {
        return await _add_counter(this.connection, item);
    }

    async add_rank(item: RankData) {
        return await _add_rank(this.connection, item);
    }

    async add_reaction_role(item: ReactionRoleData) {
        return await _add_reaction_role(this.connection, item);
    }

    async add_inventory_item(item: UserItemData) {
        return await _add_inventory_item(this.connection, item);
    }

    async add_user_notification(item: NotificationData) {
        return await _add_user_notification(this.connection, item);
    }

    async edit_config(item: BotData) {
        return await _edit_config(this.connection, item);
    }

    async edit_server(item: GuildData, type: GuildEditType) {
        return await _edit_server(this.connection, item, type);
    }

    async edit_server_user(item: ServerUserData) {
        return await _edit_server_user(this.connection, item);
    }

    async edit_global_user(item: GlobalUserData) {
        return await _edit_global_user(this.connection, item);
    }

    async edit_counter(item: CounterData) {
        return await _edit_counter(this.connection, item);
    }

    async fetch_config(id: string): Promise<BotData | null> {
        return await _fetch_config(this.connection, id);
    }

    async fetch_server(id: string, type: GuildFetchType, contains_extra: boolean, contains_ranks: boolean): Promise<GuildData | null> {
        return await _fetch_server(this.connection, id, type, contains_extra, contains_ranks);
    }

    async fetch_server_bans(id: string): Promise<ServerBanData[]> {
        return await _fetch_server_bans(this.connection, id);
    }

    async fetch_all_expired_bans(): Promise<ServerBanData[]> {
        return await _fetch_all_expired_bans(this.connection);
    }

    async fetch_server_mutes(id: string): Promise<ServerMuteData[]> {
        return await _fetch_server_mutes(this.connection, id);
    }

    async fetch_all_expired_mutes(): Promise<ServerMuteData[]> {
        return await _fetch_all_expired_mutes(this.connection);
    }

    async fetch_server_warnings(id: string): Promise<ServerWarnData[]> {
        return await _fetch_server_warnings(this.connection, id);
    }

    async fetch_server_counters(id: string): Promise<CounterData[]> {
        return await _fetch_server_counters(this.connection, id);
    }

    async fetch_all_counters(): Promise<CounterData[]> {
        return await _fetch_all_counters(this.connection);
    }

    async fetch_server_reaction_roles(id: string): Promise<ReactionRoleData[]> {
        return await _fetch_server_reaction_roles(this.connection, id);
    }

    async fetch_all_reaction_roles(): Promise<ReactionRoleData[]> {
        return await _fetch_all_reaction_roles(this.connection);
    }

    async fetch_server_ranks(id: string): Promise<RankData[]> {
        return await _fetch_server_ranks(this.connection, id);
    }

    async fetch_server_user(server_ID: string, user_ID: string): Promise<ServerUserData | null> {
        return await _fetch_server_user(this.connection, server_ID, user_ID);
    }

    async fetch_server_users(id: string): Promise<ServerUserData[]> {
        return await _fetch_server_users(this.connection, id);
    }

    async fetch_global_user(id: string, contains_inventory: boolean, contains_notifications: boolean): Promise<GlobalUserData | null> {
        return await _fetch_global_user(this.connection, id, contains_inventory, contains_notifications);
    }

    async fetch_all_global_users(contains_inventory: boolean, contains_notifications: boolean): Promise<GlobalUserData[]> {
        return await _fetch_all_global_users(this.connection, contains_inventory, contains_notifications);
    }

    async fetch_all_global_users_with_buildings(contains_inventory: boolean, contains_notifications: boolean): Promise<GlobalUserData[]> {
        return await _fetch_all_global_users_with_buildings(this.connection, contains_inventory, contains_notifications);
    }

    async fetch_user_inventory_items(id: string): Promise<UserItemData[]> {
        return await _fetch_user_inventory_items(this.connection, id);
    }

    async fetch_user_notifications(id: string): Promise<NotificationData[]> {
        return await _fetch_user_notifications(this.connection, id);
    }

    async remove_server_ban(id: string) {
        return await _remove_server_ban(this.connection, id);
    }

    async remove_server_mute(id: string) {
        return await _remove_server_mute(this.connection, id);
    }

    async remove_server_warnings_from_user(server_ID: string, user_ID: string) {
        return await _remove_server_warnings_from_user(this.connection, server_ID, user_ID);
    }

    async remove_rank(id: string) {
        return await _remove_rank(this.connection, id);
    }

    async remove_inventory_item(id: string) {
        return await _remove_inventory_item(this.connection, id);
    }
}

export default Database;
