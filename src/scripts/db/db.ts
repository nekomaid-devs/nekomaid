/* Node Imports */
import { AuditGuildData, BotData, CounterData, UserData, GuildData, MessageCreateGuildData, NotificationData, RankData, ReactionRoleData, GuildBanData, GuildMuteData, UserGuildData, GuildWarnData, UserItemData } from "../../ts/base";
import { GuildFetchType } from "../../ts/mysql";
import { Connection } from "mysql2/promise";

/* Local Imports */
import { _add_guild_counter, _add_user, _add_inventory_item, _add_guild_rank, _add_guild_reaction_role, _add_guild, _add_guild_ban, _add_guild_mute, _add_guild_user, _add_guild_warning, _add_notification } from "./db_add";
import { _edit_config, _edit_guild_counter, _edit_user, _edit_guild, _edit_guild_user, _edit_audit_guild } from "./db_edit";
import {
    _fetch_all_counters,
    _fetch_all_expired_bans,
    _fetch_all_expired_mutes,
    _fetch_all_users,
    _fetch_all_users_with_buildings,
    _fetch_all_reaction_roles,
    _fetch_config,
    _fetch_user,
    _fetch_guild,
    _fetch_guild_bans,
    _fetch_guild_counters,
    _fetch_guild_mutes,
    _fetch_guild_ranks,
    _fetch_guild_reaction_roles,
    _fetch_guild_user,
    _fetch_guild_users,
    _fetch_guild_warnings,
    _fetch_inventory_items,
    _fetch_notifications,
} from "./db_fetch";
import { _remove_inventory_item, _remove_guild_rank, _remove_guild_ban, _remove_guild_mute, _remove_guild_warnings_from_user } from "./db_remove";

class Database {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async add_guild(id: string) {
        return await _add_guild(this.connection, id);
    }

    async add_guild_ban(item: GuildBanData) {
        return await _add_guild_ban(this.connection, item);
    }

    async add_guild_mute(item: GuildMuteData) {
        return await _add_guild_mute(this.connection, item);
    }

    async add_guild_warning(item: GuildWarnData) {
        return await _add_guild_warning(this.connection, item);
    }

    async add_guild_user(guild_ID: string, user_ID: string) {
        return await _add_guild_user(this.connection, guild_ID, user_ID);
    }

    async add_guild_counter(item: CounterData) {
        return await _add_guild_counter(this.connection, item);
    }

    async add_guild_rank(item: RankData) {
        return await _add_guild_rank(this.connection, item);
    }

    async add_guild_reaction_role(item: ReactionRoleData) {
        return await _add_guild_reaction_role(this.connection, item);
    }

    async add_user(id: string) {
        return await _add_user(this.connection, id);
    }

    async add_inventory_item(item: UserItemData) {
        return await _add_inventory_item(this.connection, item);
    }

    async add_notification(item: NotificationData) {
        return await _add_notification(this.connection, item);
    }

    async edit_config(item: BotData) {
        return await _edit_config(this.connection, item);
    }

    async edit_audit_guild(item: AuditGuildData) {
        return await _edit_audit_guild(this.connection, item);
    }

    async edit_guild(item: GuildData) {
        return await _edit_guild(this.connection, item);
    }

    async edit_guild_user(item: UserGuildData) {
        return await _edit_guild_user(this.connection, item);
    }

    async edit_guild_counter(item: CounterData) {
        return await _edit_guild_counter(this.connection, item);
    }

    async edit_user(item: UserData) {
        return await _edit_user(this.connection, item);
    }

    async fetch_config(id: string, flags: number): Promise<BotData | null> {
        return await _fetch_config(this.connection, id, flags);
    }

    async fetch_audit_guild(id: string): Promise<AuditGuildData | null> {
        return await _fetch_guild(this.connection, id, GuildFetchType.AUDIT, 0);
    }

    async fetch_message_create_guild(id: string): Promise<MessageCreateGuildData | null> {
        return await _fetch_guild(this.connection, id, GuildFetchType.MESSAGE_CREATE, 0);
    }

    async fetch_guild(id: string, flags: number): Promise<GuildData | null> {
        return await _fetch_guild(this.connection, id, GuildFetchType.ALL, flags);
    }

    async fetch_guild_bans(id: string): Promise<GuildBanData[]> {
        return await _fetch_guild_bans(this.connection, id);
    }

    async fetch_all_expired_bans(): Promise<GuildBanData[]> {
        return await _fetch_all_expired_bans(this.connection);
    }

    async fetch_guild_mutes(id: string): Promise<GuildMuteData[]> {
        return await _fetch_guild_mutes(this.connection, id);
    }

    async fetch_all_expired_mutes(): Promise<GuildMuteData[]> {
        return await _fetch_all_expired_mutes(this.connection);
    }

    async fetch_guild_warnings(id: string): Promise<GuildWarnData[]> {
        return await _fetch_guild_warnings(this.connection, id);
    }

    async fetch_guild_counters(id: string): Promise<CounterData[]> {
        return await _fetch_guild_counters(this.connection, id);
    }

    async fetch_all_counters(): Promise<CounterData[]> {
        return await _fetch_all_counters(this.connection);
    }

    async fetch_guild_reaction_roles(id: string): Promise<ReactionRoleData[]> {
        return await _fetch_guild_reaction_roles(this.connection, id);
    }

    async fetch_all_reaction_roles(): Promise<ReactionRoleData[]> {
        return await _fetch_all_reaction_roles(this.connection);
    }

    async fetch_guild_ranks(id: string): Promise<RankData[]> {
        return await _fetch_guild_ranks(this.connection, id);
    }

    async fetch_guild_user(guild_ID: string, user_ID: string): Promise<UserGuildData | null> {
        return await _fetch_guild_user(this.connection, guild_ID, user_ID);
    }

    async fetch_guild_users(id: string): Promise<UserGuildData[]> {
        return await _fetch_guild_users(this.connection, id);
    }

    async fetch_user(id: string, contains_inventory: boolean, contains_notifications: boolean): Promise<UserData | null> {
        return await _fetch_user(this.connection, id, contains_inventory, contains_notifications);
    }

    async fetch_all_users(contains_inventory: boolean, contains_notifications: boolean): Promise<UserData[]> {
        return await _fetch_all_users(this.connection, contains_inventory, contains_notifications);
    }

    async fetch_all_users_with_buildings(contains_inventory: boolean, contains_notifications: boolean): Promise<UserData[]> {
        return await _fetch_all_users_with_buildings(this.connection, contains_inventory, contains_notifications);
    }

    async fetch_inventory_items(id: string): Promise<UserItemData[]> {
        return await _fetch_inventory_items(this.connection, id);
    }

    async fetch_notifications(id: string): Promise<NotificationData[]> {
        return await _fetch_notifications(this.connection, id);
    }

    async remove_guild_ban(id: string) {
        return await _remove_guild_ban(this.connection, id);
    }

    async remove_guild_mute(id: string) {
        return await _remove_guild_mute(this.connection, id);
    }

    async remove_guild_warnings_from_user(guild_ID: string, user_ID: string) {
        return await _remove_guild_warnings_from_user(this.connection, guild_ID, user_ID);
    }

    async remove_guild_rank(id: string) {
        return await _remove_guild_rank(this.connection, id);
    }

    async remove_inventory_item(id: string) {
        return await _remove_inventory_item(this.connection, id);
    }
}

export default Database;
