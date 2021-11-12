/* Types */
import { BotData, CounterData, UserData, GuildData, UserGuildData, AuditGuildData } from "../../ts/base";

/* Node Imports */
import { Connection } from "mysql2/promise";

export async function _edit_config(connection: Connection, item: BotData) {
    const query = `UPDATE configs SET
        bot_owners=?,
        shrine_bonus=?, work_multiplier=?, crime_multiplier=?, daily_multiplier=?,
        mayor_ID=?, b_mayor_house=?, b_mayor_house_credits=?, b_shrine=?, b_shrine_credits=?, b_community_center=?, b_community_center_credits=?,
        b_quantum_pancakes=?,  b_quantum_pancakes_credits=?, b_crime_monopoly=?, b_crime_monopoly_credits=?, b_pet_shelter=?, b_pet_shelter_credits=?
        WHERE id=?`;
    const query_data = [
        item.bot_owners.join(","),

        item.shrine_bonus,
        item.work_multiplier,
        item.crime_multiplier,
        item.daily_multiplier,

        item.mayor_ID,
        item.b_mayor_house,
        item.b_mayor_house_credits,
        item.b_shrine,
        item.b_shrine_credits,
        item.b_community_center,
        item.b_community_center_credits,
        item.b_quantum_pancakes,
        item.b_quantum_pancakes_credits,
        item.b_crime_monopoly,
        item.b_crime_monopoly_credits,
        item.b_pet_shelter,
        item.b_pet_shelter_credits,
    ];
    return await connection.execute(query, query_data);
}

export async function _edit_audit_guild(connection: Connection, item: AuditGuildData) {
    const query = "UPDATE guilds SET caseID=? WHERE id=?";
    const query_data = [item.case_ID, item.id];
    return await connection.execute(query, query_data);
}

export async function _edit_guild(connection: Connection, item: GuildData) {
    const query = `UPDATE guilds SET
        prefix=?, say_command=?, case_ID=?, mute_role_ID=?, invites=?, banned_words=?,
        auto_roles=?,
        welcome_messages=?, welcome_messages_channel=?, welcome_messages_ping=?, welcome_messages_format=?,
        leave_messages=?, leave_messages_channel=?, leave_messages_format=?,
        module_level_enabled=?, module_level_message_exp=?, module_level_level_exp=?, module_level_level_multiplier=?, module_level_levelup_messages=?, module_level_levelup_messages_channel=?, module_level_levelup_messages_format=?, module_level_levelup_messages_ping=?, module_level_ignored_channels=?,
        audit_channel=?, audit_bans=?, audit_mutes=?, audit_kicks=?, audit_warns=?, audit_nicknames=?, audit_deleted_messages=?, audit_edited_messages=?
        WHERE id=?`;
    const query_data = [
        item.prefix,
        item.say_command,
        item.case_ID,
        item.mute_role_ID,
        item.invites,
        item.banned_words.join(","),

        item.auto_roles.join(","),

        item.welcome_messages,
        item.welcome_messages_channel,
        item.welcome_messages_ping,
        item.welcome_messages_format,

        item.leave_messages,
        item.leave_messages_format,
        item.leave_messages_channel,

        item.module_level_enabled,
        item.module_level_message_exp,
        item.module_level_level_exp,
        item.module_level_level_multiplier,
        item.module_level_levelup_messages,
        item.module_level_levelup_messages_channel,
        item.module_level_levelup_messages_ping,
        item.module_level_levelup_messages_format,
        item.module_level_ignored_channels.join(","),

        item.audit_channel,
        item.audit_bans,
        item.audit_kicks,
        item.audit_mutes,
        item.audit_warns,
        item.audit_nicknames,
        item.audit_deleted_messages,
        item.audit_edited_messages,

        item.id,
    ];

    return await connection.execute(query, query_data);
}

export async function _edit_guild_user(connection: Connection, item: UserGuildData) {
    const query = "UPDATE guild_users SET level=?, xp=? WHERE fast_find_ID=?";
    const query_data = [item.level, item.xp, item.fast_find_ID];
    return await connection.execute(query, query_data);
}

export async function _edit_guild_counter(connection: Connection, item: CounterData) {
    const query = "UPDATE guild_counters SET last_update=? WHERE id=?";
    const query_data = [item.last_update, item.id];
    return await connection.execute(query, query_data);
}

export async function _edit_user(connection: Connection, item: UserData) {
    const query = `UPDATE users SET
    credits=?, bank=?, level=?, xp=?, rep=?, net_worth=?, votes=?, married_ID=?, can_divorce=?,
    last_daily_time=?, last_upvoted_time=?, last_beg_time=?, last_rep_time=?, last_work_time=?, last_steal_time=?, last_crime_time=?,
    osu_username=?,
    b_city_hall=?, b_city_hall_credits=?, b_bank=?, b_bank_credits=?, b_pancakes=?, b_pancakes_credits=?, b_crime_den=?, b_crime_den_credits=?,
    b_pawn_shop=?, b_pawn_shop_credits=?, b_pawn_shop_last_update=?, b_scrapyard=?, b_scrapyard_credits=?, b_scrapyard_last_update=?, b_casino=?, b_casino_credits=?, b_casino_last_update=?,
    b_lewd_services=?, b_lewd_services_credits=?, b_lewd_services_last_update=?, b_sanctuary=?, b_sanctuary_credits=?, b_lab=?, b_lab_credits=?
    WHERE id=?`;
    const query_data = [
        item.credits,
        item.bank,
        item.level,
        item.xp,
        item.rep,
        item.net_worth,
        item.votes,
        item.married_ID,
        item.can_divorce,

        item.last_daily_time,
        item.last_upvoted_time,
        item.last_beg_time,
        item.last_rep_time,
        item.last_work_time,
        item.last_steal_time,
        item.last_crime_time,

        item.osu_username,

        item.b_city_hall,
        item.b_city_hall_credits,
        item.b_bank,
        item.b_bank_credits,
        item.b_pancakes,
        item.b_pancakes_credits,
        item.b_crime_den,
        item.b_crime_den_credits,
        item.b_pawn_shop,
        item.b_pawn_shop_credits,
        item.b_pawn_shop_last_update,
        item.b_scrapyard,
        item.b_scrapyard_credits,
        item.b_scrapyard_last_update,
        item.b_casino,
        item.b_casino_credits,
        item.b_casino_last_update,
        item.b_lewd_services,
        item.b_lewd_services_credits,
        item.b_lewd_services_last_update,
        item.b_sanctuary,
        item.b_sanctuary_credits,
        item.b_lab,
        item.b_lab_credits,

        item.id,
    ];

    return await connection.execute(query, query_data);
}
