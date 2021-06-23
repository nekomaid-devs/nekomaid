module.exports = {
    async edit(ssm, data) {
        console.log("SQL - Editing data of type " + data.type + "..."); 

        switch(data.type) {
            case "config": {
                const config = data.config;

                //Regular data
                const query0 = "botOwners=?, suggestionID=?"
                const queryData = [ config.botOwners.join(","), config.suggestionID ]
                const query = "UPDATE configs SET " + query0 + " WHERE id='" + data.id + "'";
                return await this.editData(ssm, query, queryData);
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
                    server.counters.forEach(c => {
                        ssm.server_add.addCounter(ssm, c);
                    })
                }
                if(server.reactionRoles !== undefined) {
                    ssm.server_remove.removeReactionRolesFromServer(ssm, server.serverID);
                    server.reactionRoles.forEach(rr => {
                        ssm.server_add.addReactionRole(ssm, rr);
                    })
                }
                if(server.module_level_ranks !== undefined) {
                    ssm.server_remove.removeRanksFromServer(ssm, server.serverID);
                    server.module_level_ranks.forEach(rank => {
                        ssm.server_add.addRank(ssm, rank);
                    })
                }

                return await this.editData(ssm, query, queryData);
            }

            case "server_cb": {
                const server = data.server;
            
                //Regular data
                const query0 = "caseID=?"
                const queryData = [ server.caseID ]

                const query = "UPDATE servers SET " + query0 + " WHERE serverID='" + server.serverID + "'";
                return await this.editData(ssm, query, queryData);
            }

            case "globalUser": {
                const user = data.user;

                //Regular data
                const query0 = "credits=?, bank=?, level=?, xp=?, rep=?, netWorth=?, votes=?, lastDailyTime=?, lastUpvotedTime=?, lastBegTime=?, lastRepTime=?, marriedID=?, osuUsername=?, canDivorce=?, lastWorkTime=?, lastStealTime=?, lastCrimeTime=?, inventory=?"
                const queryData = [ user.credits, user.bank, user.level, user.xp, user.rep, user.netWorth, user.votes, user.lastDailyTime, user.lastUpvotedTime, user.lastBegTime, user.lastRepTime, user.marriedID, user.osuUsername, user.canDivorce, user.lastWorkTime, user.lastStealTime, user.lastCrimeTime, user.inventory.join(",") ]
                const query = "UPDATE globalusers SET " + query0 + " WHERE userID='" + user.userID + "'";
                return await this.editData(ssm, query, queryData);
            }

            case "serverUser": {
                const user = data.user;
                let fastFindID = data.serverID + "-" + data.userID;

                //Regular data
                const query0 = "level=?, xp=?"
                const queryData = [ user.level, user.xp ]
                const query = "UPDATE serverusers SET " + query0 + " WHERE fastFindID='" + fastFindID + "'";
                return await this.editData(ssm, query, queryData);
            }
        }
    },

    async editData(db, query, queryData) {
        let res = await db.sqlConn.promise().execute(query, queryData);
        return res;
    },

    editServerLogsInStructure(ssm, server, newData) {
        var serverLogsPrefabData = JSON.stringify(newData);
        var query = "UPDATE serverlogs SET data='" + serverLogsPrefabData.split("'").join("''") + "' WHERE serverID='" + server.id + "'";

        ssm.sqlConn.promise().query(query)
        .then((result, err) => {
            if(err) { throw err; }
        });
    }
}