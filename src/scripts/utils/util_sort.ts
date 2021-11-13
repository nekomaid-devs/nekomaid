/* Types */
import { GlobalContext, UserData, GuildData, UserGuildData } from "../../ts/base";
import { Guild } from "discord.js-light";

/* Local Imports */
import { get_guild_level_XP } from "../utils/util_general";

export function create_comparator(props: string[]) {
    return (a: any, b: any) => {
        const a_net = props.reduce((acc: any, curr: any) => {
            acc += isNaN(parseFloat(a[curr])) ? 0 : parseFloat(a[curr]);
            return acc;
        }, 0);
        const b_net = props.reduce((acc: any, curr: any) => {
            acc += isNaN(parseFloat(b[curr])) ? 0 : parseFloat(b[curr]);
            return acc;
        }, 0);

        return b_net - a_net;
    };
}

export function create_comparator_guild_level(global_context: GlobalContext, guild_data: GuildData) {
    return (a: UserGuildData, b: UserGuildData) => {
        const level_XP_a = get_guild_level_XP(guild_data, a);
        const level_XP_b = get_guild_level_XP(guild_data, b);

        const a_net = a.level + a.xp / level_XP_a;
        const b_net = b.level + b.xp / level_XP_b;

        return b_net - a_net;
    };
}

export async function get_top(global_context: GlobalContext, props: string[]) {
    const items = await global_context.neko_modules_clients.db.fetch_all_users(0);
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_guild(global_context: GlobalContext, guild: Guild, props: string[]) {
    const members = await guild.members.fetch();
    let items = await global_context.neko_modules_clients.db.fetch_all_users(0);
    items = items.filter((val: UserData) => {
        return members.has(val.id);
    });
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_guild_level(global_context: GlobalContext, guild_data: GuildData, guild: Guild) {
    const items = await global_context.neko_modules_clients.db.fetch_guild_users(guild.id);
    items.sort(create_comparator_guild_level(global_context, guild_data));

    return items;
}
