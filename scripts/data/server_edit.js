module.exports = {
    async edit(global_context, data) {
        switch(data.type) {
            case "config": {
                let config = data.config;

                let query_0 = "bot_owners=?, mayor_ID=?, shrine_bonus=?, work_multiplier=?, crime_multiplier=?, daily_multiplier=?" + 
                ", b_mayor_house=?, b_shrine=?, b_community_center=?, b_quantum_pancakes=?, b_crime_monopoly=?, b_pet_shelter=?" + 
                ", b_mayor_house_credits=?, b_shrine_credits=?, b_community_center_credits=?, b_quantum_pancakes_credits=?, b_crime_monopoly_credits=?, b_pet_shelter_credits=?"
                let query_data = [ config.bot_owners.join(","), config.mayor_ID,
                config.b_mayor_house, config.b_shrine, config.b_community_center, config.b_quantum_pancakes, config.b_crime_monopoly, config.b_pet_shelter,
                config.b_mayor_house_credits, config.b_shrine_credits, config.b_community_center_credits, config.b_quantum_pancakes_credits, config.b_crime_monopoly_credits, config.b_pet_shelter_credits ]
                
                let query = "UPDATE configs SET " + query_0 + " WHERE id='" + config.id + "'";
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
                let query_0 = "credits=?, bank=?, level=?, xp=?, rep=?, net_worth=?, votes=?, last_daily_time=?, last_upvoted_time=?, last_beg_time=?, last_rep_time=?, married_ID=?, osu_username=?, can_divorce=?, last_work_time=?, last_steal_time=?, last_crime_time=?" + 
                ", b_city_hall=?, b_bank=?, b_lab=?, b_sanctuary=?, b_pancakes=?, b_crime_den=?, b_lewd_services=?, b_casino=?, b_scrapyard=?, b_pawn_shop=?" + 
                ", b_city_hall_credits=?, b_bank_credits=?, b_lab_credits=?, b_sanctuary_credits=?, b_pancakes_credits=?, b_crime_den_credits=?, b_lewd_services_credits=?, b_casino_credits=?, b_scrapyard_credits=?, b_pawn_shop_credits=?" + 
                ", b_lewd_services_last_update=?, b_casino_last_update=?, b_scrapyard_last_update=?"
                let query_data = [ user.credits, user.bank, user.level, user.xp, user.rep, user.net_worth, user.votes, user.last_daily_time, user.last_upvoted_time, user.last_beg_time, user.last_rep_time, user.married_ID, user.osu_username, user.can_divorce, user.last_work_time, user.last_steal_time, user.last_crime_time,
                user.b_city_hall, user.b_bank, user.b_lab, user.b_sanctuary, user.b_pancakes, user.b_crime_den, user.b_lewd_services, user.b_casino, user.b_scrapyard, user.b_pawn_shop,
                user.b_city_hall_credits, user.b_bank_credits, user.b_lab_credits, user.b_sanctuary_credits, user.b_pancakes_credits, user.b_crime_den_credits, user.b_lewd_services_credits, user.b_casino_credits, user.b_scrapyard_credits, user.b_pawn_shop_credits,
                user.b_lewd_services_last_update, user.b_casino_last_update, user.b_scrapyard_last_update ]
                
                let query = "UPDATE global_users SET " + query_0 + " WHERE user_ID='" + user.user_ID + "'";
                if(user.inventory !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_inventory_items_from_user(global_context, user.user_ID);
                    user.inventory.forEach(i => {
                        global_context.neko_modules_clients.ssm.server_add.add_inventory_item(global_context, i);
                    })
                }
                if(user.notifications !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_user_notification_from_user(global_context, user.user_ID);
                    user.notifications.forEach(i => {
                        global_context.neko_modules_clients.ssm.server_add.add_user_notification(global_context, i);
                    })
                }

                return await this.edit_data(global_context, query, query_data);
            }

            case "server_user": {
                let user = data.user;
                let query_0 = "level=?, xp=?";
                let query_data = [ user.level, user.xp ];
                
                let query = "UPDATE server_users SET " + query_0 + " WHERE fast_find_ID='" + (user.server_ID + "-" + user.user_ID) + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "counter": {
                let counter = data.counter;
                let query_0 = "last_update=?";
                let query_data = [ counter.last_update ];

                let query = "UPDATE server_counters SET " + query_0 + " WHERE id='" + counter.id + "'";
                return await this.edit_data(global_context, query, query_data);
            }
        }
    },

    async edit_data(global_context, query, query_data) {
        let res = await global_context.neko_modules_clients.ssm.sql_connection.promise().execute(query, query_data);
        return res;
    }
}