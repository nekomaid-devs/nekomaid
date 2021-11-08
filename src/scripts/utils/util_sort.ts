/* Types */
import { GlobalContext, GlobalUserData, GuildData, ServerUserData } from "../../ts/base";
import { Guild } from "discord.js-light";

/* Local Imports */
import { get_server_level_XP } from "../utils/util_general";

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

export function create_comparator_server_level(global_context: GlobalContext, server_config: GuildData) {
    return (a: ServerUserData, b: ServerUserData) => {
        const level_XP_a = get_server_level_XP(server_config, a);
        const level_XP_b = get_server_level_XP(server_config, b);

        const a_net = a.level + a.xp / level_XP_a;
        const b_net = b.level + b.xp / level_XP_b;

        return b_net - a_net;
    };
}

export async function get_top(global_context: GlobalContext, props: string[]) {
    const items = await global_context.neko_modules_clients.db.fetch_all_global_users(false, false);
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_server(global_context: GlobalContext, server: Guild, props: string[]) {
    let items = await global_context.neko_modules_clients.db.fetch_all_global_users(false, false);
    items = items.filter((val: GlobalUserData) => {
        return server.members.cache.has(val.user_ID);
    });
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_server_level(global_context: GlobalContext, server_config: GuildData, server: Guild) {
    const items = await global_context.neko_modules_clients.db.fetch_server_users(server.id);
    items.sort(create_comparator_server_level(global_context, server_config));

    return items;
}