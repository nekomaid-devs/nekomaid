/* Types */
import { BotData, CounterData, GlobalUserData, GuildData, ServerUserData } from "../../ts/base";
import { GuildEditType, guild_edit_type_to_query, guild_edit_type_to_query_data } from "./db_utils";

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

export async function _edit_server(connection: Connection, item: GuildData, type: GuildEditType) {
    const query = guild_edit_type_to_query(type);
    const query_data = guild_edit_type_to_query_data(item, type);
    return await connection.execute(query, query_data);
}

export async function _edit_server_user(connection: Connection, item: ServerUserData) {
    const query = "UPDATE server_users SET level=?, xp=? WHERE fast_find_ID=?";
    const query_data = [ item.level, item.xp, item.fast_find_ID ];
    return await connection.execute(query, query_data);
}

export async function _edit_global_user(connection: Connection, item: GlobalUserData) {
    const query = `UPDATE global_users SET
    credits=?, bank=?, level=?, xp=?, rep=?, net_worth=?, votes=?, married_ID=?, can_divorce=?,
    last_daily_time=?, last_upvoted_time=?, last_beg_time=?, last_rep_time=?,last_work_time=?, last_steal_time=?, last_crime_time=?,
    osu_username=?,
    b_city_hall=?, b_city_hall_credits=?, b_bank=?, b_bank_credits=?, b_pancakes=?, b_pancakes_credits=?, b_crime_den=?, b_crime_den_credits=?,
    b_pawn_shop=?, b_pawn_shop_credits=?, b_pawn_shop_last_update=?, b_scrapyard=?, b_scrapyard_credits=?, b_scrapyard_last_update=?, b_casino=?, b_casino_credits=?, b_casino_last_update=?,
    b_lewd_services=?, b_lewd_services_credits=?, b_lewd_services_last_update=?, b_sanctuary=?, b_sanctuary_credits=?, b_lab=?, b_lab_credits=?
    WHERE user_ID=?`;
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

        item.last_work_time,
        item.last_crime_time,
        item.last_daily_time,
        item.last_steal_time,
        item.last_rep_time,
        item.last_upvoted_time,
        item.last_beg_time,

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

        item.user_ID,
    ];

    return await connection.execute(query, query_data);
}

export async function _edit_counter(connection: Connection, item: CounterData) {
    const query = "UPDATE server_counters SET last_update=? WHERE id=?";
    const query_data = [ item.last_update, item.id ];
    return await connection.execute(query, query_data);
}
