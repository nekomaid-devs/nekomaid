module.exports = {
    async edit(global_context, data) {
        global_context.logger.log("[Database] Editing data of type " + data.type + "..."); 

        switch(data.type) {
            case "config": {
                let config = data.config;

                let query_0 = "botOwners=?, suggestionID=?"
                let query_data = [ config.botOwners.join(","), config.suggestionID ]
                let query = "UPDATE configs SET " + query_0 + " WHERE id='" + data.id + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "server": {
                let server = data.server;

                let query_0 = "prefix=?, sayCommand=?, welcomeMessages=?, welcomeMessages_format=?, welcomeMessages_channel=?, welcomeMessages_ping=?, leaveMessages=?, leaveMessages_format=?, leaveMessages_channel=?, autoRoles=?, " +
                "module_level_enabled=?, module_level_message_exp=?, module_level_level_exp=?, module_level_levelupMessages=?, module_level_levelupMessages_format=?, module_level_levelupMessages_channel=?, module_level_levelupMessages_ping=?, module_level_ignoredChannels=?, " + 
                "module_level_level_multiplier=?, audit_channel=?, audit_bans=?, audit_kicks=?, audit_mutes=?, audit_warns=?, audit_nicknames=?, audit_deletedMessages=?, bannedWords=?, caseID=?, invites=?, muteRoleID=?"
                
                let query_data = [ server.prefix, server.sayCommand, server.welcomeMessages, server.welcomeMessages_format, server.welcomeMessages_channel, server.welcomeMessages_ping, server.leaveMessages, server.leaveMessages_format, server.leaveMessages_channel, server.autoRoles.join(","),
                server.module_level_enabled, server.module_level_message_exp, server.module_level_level_exp, server.module_level_levelupMessages, server.module_level_levelupMessages_format, server.module_level_levelupMessages_channel, server.module_level_levelupMessages_ping, server.module_level_ignoredChannels.join(","),
                server.module_level_level_multiplier, server.audit_channel, server.audit_bans, server.audit_kicks, server.audit_mutes, server.audit_warns, server.audit_nicknames, server.audit_deletedMessages, server.bannedWords.join(","), server.caseID, server.invites, server.muteRoleID ]

                let query = "UPDATE servers SET " + query_0 + " WHERE serverID='" + server.serverID + "'";
                if(server.counters !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_counters_from_server(global_context, server.serverID);
                    server.counters.forEach(c => {
                        global_context.neko_modules_clients.ssm.server_add.add_counter(global_context, c);
                    })
                }
                if(server.reactionRoles !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_reaction_roles_from_server(global_context, server.serverID);
                    server.reactionRoles.forEach(rr => {
                        global_context.neko_modules_clients.ssm.server_add.add_reaction_role(global_context, rr);
                    })
                }
                if(server.module_level_ranks !== undefined) {
                    global_context.neko_modules_clients.ssm.server_remove.remove_ranks_from_server(global_context, server.serverID);
                    server.module_level_ranks.forEach(rank => {
                        global_context.neko_modules_clients.ssm.server_add.add_rank(global_context, rank);
                    })
                }

                return await this.edit_data(global_context, query, query_data);
            }

            case "server_cb": {
                let server = data.server;

                let query_0 = "caseID=?"
                let query_data = [ server.caseID ]
                let query = "UPDATE servers SET " + query_0 + " WHERE serverID='" + server.serverID + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "global_user": {
                let user = data.user;

                let query_0 = "credits=?, bank=?, level=?, xp=?, rep=?, netWorth=?, votes=?, lastDailyTime=?, lastUpvotedTime=?, lastBegTime=?, lastRepTime=?, marriedID=?, osuUsername=?, canDivorce=?, lastWorkTime=?, lastStealTime=?, lastCrimeTime=?, inventory=?"
                let query_data = [ user.credits, user.bank, user.level, user.xp, user.rep, user.netWorth, user.votes, user.lastDailyTime, user.lastUpvotedTime, user.lastBegTime, user.lastRepTime, user.marriedID, user.osuUsername, user.canDivorce, user.lastWorkTime, user.lastStealTime, user.lastCrimeTime, user.inventory.join(",") ]
                let query = "UPDATE globalusers SET " + query_0 + " WHERE userID='" + user.userID + "'";
                return await this.edit_data(global_context, query, query_data);
            }

            case "server_user": {
                let user = data.user;

                let query_0 = "level=?, xp=?"
                let query_data = [ user.level, user.xp ]
                let query = "UPDATE serverusers SET " + query_0 + " WHERE fastFindID='" + (data.serverID + "-" + data.userID) + "'";
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
        var query = "UPDATE serverlogs SET data='" + serverLogsPrefabData.split("'").join("''") + "' WHERE serverID='" + server.id + "'";

        global_context.neko_modules_clients.ssm.sql_connection.promise().query(query)
        .then((result, err) => {
            if(err) { throw err; }
        });
    }
}