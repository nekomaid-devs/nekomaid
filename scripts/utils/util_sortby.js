class SortBy {
    SortBy(global_context) {
        this.global_context = global_context;
    }

    createComparator(props) {
        return function(a, b) {
            var aNet = 0;
            var bNet = 0;

            props.forEach(prop => {
                aNet += isNaN(parseFloat(a[prop])) ? 0 : parseFloat(a[prop]);
                bNet += isNaN(parseFloat(b[prop])) ? 0 : parseFloat(b[prop]);
            })
            
            return bNet - aNet;
        }
    }

    createComparatorServerLevel(serverConfig) {
        return function(a, b) {
            var levelXP = serverConfig.module_level_level_exp;
            for(var i2 = 1; i2 < a.level; i2 += 1) {
                levelXP *= serverConfig.module_level_level_multiplier;
            }

            var aNet = a.level + (a.xp / levelXP);
            var bNet = b.level + (b.xp / levelXP);
            
            return bNet - aNet;
        }
    }

    createComparatorViews() {
        return function(a, b) {
            var aNet = a.views;
            var bNet = b.views;
            
            return bNet - aNet;
        }
    }

    async updateTop(global_context, props) {
        var t0 = Date.now();

        var globalUserTop = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_users" });
        var comparator = this.createComparator(props);
        globalUserTop.sort(comparator);
    
        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        return { elapsed: secTaken, items: globalUserTop };
    }

    async updateTopServer(global_context, server, props) {
        var t0 = Date.now();

        // TODO: this won't work
        var serverUserTop = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_users" });
        var serverUserTop2 = serverUserTop.filter(val =>
            server.members.cache.has(val.userID)
        );

        var comparator = this.createComparator(props);
        serverUserTop2.sort(comparator);
    
        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        return { elapsed: secTaken, items: serverUserTop2 };
    }

    async updateTopServerLevel(global_context, serverConfig, server) {
        var t0 = Date.now();

        var serverUserTop = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverUsers", id: server.id });
        var comparator = this.createComparatorServerLevel(serverConfig);
        serverUserTop.sort(comparator);
    
        var t1 = Date.now();
        var secTaken = ((t1 - t0) / 1000).toFixed(3);

        return { elapsed: secTaken, items: serverUserTop };
    }
}

module.exports = SortBy;