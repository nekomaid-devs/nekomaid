class SortBy {
    SortBy(global_context) {
        this.global_context = global_context;
    }

    create_comparator(props) {
        return (a, b) => {
            let a_net = 0;
            let b_net = 0;
            props.forEach(prop => {
                a_net += isNaN(parseFloat(a[prop])) ? 0 : parseFloat(a[prop]);
                b_net += isNaN(parseFloat(b[prop])) ? 0 : parseFloat(b[prop]);
            })
            
            return b_net - a_net;
        }
    }

    create_comparator_server_level(server_config) {
        return (a, b) => {
            let levelXP = server_config.module_level_level_exp;
            for(let i = 1; i < a.level; i++) {
                levelXP *= server_config.module_level_level_multiplier;
            }

            let a_net = a.level + (a.xp / levelXP);
            let b_net = b.level + (b.xp / levelXP);
            
            return b_net - a_net;
        }
    }

    async get_top(global_context, props) {
        let items = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_users" });
        items.sort(this.create_comparator(props));

        return items;
    }

    async get_top_server(global_context, server, props) {
        // TODO: this won't work
        let items = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_users" });
        items = items.filter(val => { return server.members.cache.has(val.userID); });
        items.sort(this.create_comparator(props));

        return items;
    }

    async get_top_server_level(global_context, server_config, server) {
        let items = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_users", id: server.id });
        items.sort(this.create_comparator_server_level(server_config));

        return items;
    }
}

module.exports = SortBy;