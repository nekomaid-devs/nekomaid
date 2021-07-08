module.exports = {
    async edit(global_context, data) {
        global_context.logger.log("[Database] Editing data of type " + data.type + "..."); 

        switch(data.type) {
            case "config": {
                let config = data.config;

                let query_0 = "bot_owners=?"
                let query_data = [ config.bot_owners.join(",") ]
                let query = "UPDATE configs SET " + query_0 + " WHERE id='" + data.id + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "server": {
                let server = data.server;

                let query_0 = "prefix=?, say_command=?, welcome_messages=?, welcome_messages_format=?, welcome_messages_channel=?, welcome_messages_ping=?, leave_messages=?, leave_messages_format=?, leave_messages_channel=?, auto_roles=?, " +
                "module_level_enabled=?, module_level_message_exp=?, module_level_level_exp=?, module_level_levelup_messages=?, module_level_levelup_messages_format=?, module_level_levelup_messages_channel=?, module_level_levelup_messages_ping=?, module_level_ignored_channels=?, " + 
                "module_level_level_multiplier=?, audit_channel=?, audit_bans=?, audit_kicks=?, audit_mutes=?, audit_warns=?, audit_nicknames=?, audit_deleted_messages=?, banned_words=?, case_ID=?, invites=?, mute_role_ID=?"
                
                let query_data = [ server.prefix, server.say_command, server.welcome_messages, server.welcome_messages_format, server.welcome_messages_channel, server.welcome_messages_ping, server.leave_messages, server.leave_messages_format, server.leave_messages_channel, server.auto_roles.join(","),
                server.module_level_enabled, server.module_level_message_exp, server.module_level_level_exp, server.module_level_levelup_messages, server.module_level_levelup_messages_format, server.module_level_levelup_messages_channel, server.module_level_levelup_messages_ping, server.module_level_ignored_channels.join(","),
                server.module_level_level_multiplier, server.audit_channel, server.audit_bans, server.audit_kicks, server.audit_mutes, server.audit_warns, server.audit_nicknames, server.audit_deleted_messages, server.banned_words.join(","), server.case_ID, server.invites, server.mute_role_ID ]

                let query = "UPDATE servers SET " + query_0 + " WHERE server_ID='" + server.server_ID + "'";
                if(server.counters !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_counters_from_server(global_context, server.server_ID);
                    server.counters.forEach(c => {
                        global_context.neko_modules_clients.ssm.server_add.add_counter(global_context, c);
                    })
                }
                if(server.reaction_roles !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_reaction_roles_from_server(global_context, server.server_ID);
                    server.reaction_roles.forEach(rr => {
                        global_context.neko_modules_clients.ssm.server_add.add_reaction_role(global_context, rr);
                    })
                }
                if(server.module_level_ranks !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_ranks_from_server(global_context, server.server_ID);
                    server.module_level_ranks.forEach(rank => {
                        global_context.neko_modules_clients.ssm.server_add.add_rank(global_context, rank);
                    })
                }

                return await this.edit_data(global_context, query, query_data);
            }

            case "server_mute": {
                let server = data.server;

                let query_0 = "mute_role_ID=?"
                let query_data = [ server.mute_role_ID ]
                let query = "UPDATE servers SET " + query_0 + " WHERE server_ID='" + server.server_ID + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "server_cb": {
                let server = data.server;

                let query_0 = "case_ID=?"
                let query_data = [ server.case_ID ]
                let query = "UPDATE servers SET " + query_0 + " WHERE server_ID='" + server.server_ID + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "global_user": {
                let user = data.user;

                let query_0 = "credits=?, bank=?, level=?, xp=?, rep=?, net_worth=?, votes=?, last_daily_time=?, last_upvoted_time=?, last_beg_time=?, last_rep_time=?, married_ID=?, osu_username=?, can_divorce=?, last_work_time=?, last_steal_time=?, last_crime_time=?, inventory=?"
                let query_data = [ user.credits, user.bank, user.level, user.xp, user.rep, user.net_worth, user.votes, user.last_daily_time, user.last_upvoted_time, user.last_beg_time, user.last_rep_time, user.married_ID, user.osu_username, user.can_divorce, user.last_work_time, user.last_steal_time, user.last_crime_time, user.inventory.join(",") ]
                let query = "UPDATE global_users SET " + query_0 + " WHERE user_ID='" + user.user_ID + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "server_user": {
                let user = data.user;

                let query_0 = "level=?, xp=?"
                let query_data = [ user.level, user.xp ]
                let query = "UPDATE server_users SET " + query_0 + " WHERE fast_find_ID='" + (data.server_ID + "-" + data.user_ID) + "'";
                return await this.edit_data(global_context, query, query_data);
            }
        }
    },

    async edit_data(global_context, query, query_data) {
        let res = await global_context.neko_modules_clients.ssm.sql_connection.promise().execute(query, query_data);
        return res;
    },

    edit_server_logs_in_structure(global_context, server, newData) {
        var serverLogsPrefabData = JSON.stringify(newData);
        var query = "UPDATE serverlogs SET data='" + serverLogsPrefabData.split("'").join("''") + "' WHERE server_ID='" + server.id + "'";

        global_context.neko_modules_clients.ssm.sql_connection.promise().query(query)
        .then((result, err) => {
            if(err) { throw err; }
        });
    }
}