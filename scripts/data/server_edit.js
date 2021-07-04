module.exports = {
    async edit(global_context, data) {
        console.log("SQL - Editing data of type " + data.type + "..."); 

        switch(data.type) {
            case "config": {
                const config = data.config;

                //Regular data
                const query0 = "botOwners=?, suggestionID=?"
                const queryData = [ config.botOwners.join(","), config.suggestionID ]
                const query = "UPDATE configs SET " + query0 + " WHERE id='" + data.id + "'";
                return await this.edit_data(global_context, query, queryData);
            }

            case "server": {
                const server = data.server;
            
                //Regular data
                const query0 = "prefix=?, sayCommand=?, welcomeMessages=?, welcomeMessages_format=?, welcomeMessages_channel=?, welcomeMessages_ping=?, leaveMessages=?, leaveMessages_format=?, leaveMessages_channel=?, autoRoles=?, " +
                "module_level_enabled=?, module_level_message_exp=?, module_level_level_exp=?, module_level_levelupMessages=?, module_level_levelupMessages_format=?, module_level_levelupMessages_channel=?, module_level_levelupMessages_ping=?, module_level_ignoredChannels=?, " + 
                "module_level_level_multiplier=?, audit_channel=?, audit_bans=?, audit_kicks=?, audit_mutes=?, audit_warns=?, audit_nicknames=?, audit_deletedMessages=?, bannedWords=?, caseID=?, invites=?, muteRoleID=?"

                const queryData = [ server.prefix, server.sayCommand, server.welcomeMessages, server.welcomeMessages_format, server.welcomeMessages_channel, server.welcomeMessages_ping, server.leaveMessages, server.leaveMessages_format, server.leaveMessages_channel, server.autoRoles.join(","),
                server.module_level_enabled, server.module_level_message_exp, server.module_level_level_exp, server.module_level_levelupMessages, server.module_level_levelupMessages_format, server.module_level_levelupMessages_channel, server.module_level_levelupMessages_ping, server.module_level_ignoredChannels.join(","),
                server.module_level_level_multiplier, server.audit_channel, server.audit_bans, server.audit_kicks, server.audit_mutes, server.audit_warns, server.audit_nicknames, server.audit_deletedMessages, server.bannedWords.join(","), server.caseID, server.invites, server.muteRoleID ]

                const query = "UPDATE servers SET " + query0 + " WHERE serverID='" + server.serverID + "'";
                if(server.counters !== undefined) {
                    // TODO: forgot to remove counters lol
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

                return await this.edit_data(global_context, query, queryData);
            }

            case "server_cb": {
                const server = data.server;
            
                //Regular data
                const query0 = "caseID=?"
                const queryData = [ server.caseID ]

                const query = "UPDATE servers SET " + query0 + " WHERE serverID='" + server.serverID + "'";
                return await this.edit_data(global_context, query, queryData);
            }

            case "global_user": {
                const user = data.user;

                //Regular data
                const query0 = "credits=?, bank=?, level=?, xp=?, rep=?, netWorth=?, votes=?, lastDailyTime=?, lastUpvotedTime=?, lastBegTime=?, lastRepTime=?, marriedID=?, osuUsername=?, canDivorce=?, lastWorkTime=?, lastStealTime=?, lastCrimeTime=?, inventory=?"
                const queryData = [ user.credits, user.bank, user.level, user.xp, user.rep, user.netWorth, user.votes, user.lastDailyTime, user.lastUpvotedTime, user.lastBegTime, user.lastRepTime, user.marriedID, user.osuUsername, user.canDivorce, user.lastWorkTime, user.lastStealTime, user.lastCrimeTime, user.inventory.join(",") ]
                const query = "UPDATE globalusers SET " + query0 + " WHERE userID='" + user.userID + "'";
                return await this.edit_data(global_context, query, queryData);
            }

            case "server_user": {
                const user = data.user;
                let fastFindID = data.serverID + "-" + data.userID;

                //Regular data
                const query0 = "level=?, xp=?"
                const queryData = [ user.level, user.xp ]
                const query = "UPDATE serverusers SET " + query0 + " WHERE fastFindID='" + fastFindID + "'";
                return await this.edit_data(global_context, query, queryData);
            }
        }
    },

    async edit_data(global_context, query, queryData) {
        let res = await global_context.neko_modules_clients.ssm.sql_connection.promise().execute(query, queryData);
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