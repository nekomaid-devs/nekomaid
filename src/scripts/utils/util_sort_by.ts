import { Guild } from "discord.js";
import { GlobalContext } from "../../ts/types";

export function create_comparator(props: any) {
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

export function create_comparator_server_level(global_context: GlobalContext, server_config: any) {
    return (a: any, b: any) => {
        const level_XP_a = global_context.utils.get_level_XP(server_config, a);
        const level_XP_b = global_context.utils.get_level_XP(server_config, b);

        const a_net = a.level + a.xp / level_XP_a;
        const b_net = b.level + b.xp / level_XP_b;

        return b_net - a_net;
    };
}

export async function get_top(global_context: GlobalContext, props: any) {
    const items = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "all_global_users" });
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_server(global_context: GlobalContext, server: Guild, props: any) {
    await global_context.utils.verify_guild_members(server);
    let items = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "all_global_users" });
    items = items.filter((val: any) => {
        return server.members.cache.has(val.user_ID);
    });
    items.sort(create_comparator(props));

    return items;
}

export async function get_top_server_level(global_context: GlobalContext, server_config: any, server: Guild) {
    const items = await global_context.neko_modules_clients.mySQL.fetch(global_context, { type: "all_server_users", id: server.id });
    items.sort(create_comparator_server_level(global_context, server_config));

    return items;
}
