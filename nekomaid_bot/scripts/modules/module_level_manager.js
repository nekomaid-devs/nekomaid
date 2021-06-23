class LevelingManager {
    async updateServerLevel(data, xpToAdd, sendLevelupMessage = true) {
        if(data.msg.author.bot === true || data.serverConfig.module_level_enabled == false) {
            return;
        }
        
        data.serverConfig = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "server", id: data.msg.guild.id, containRanks: true });
        if(data.serverConfig.module_level_ignoredChannels.includes(data.msg.channel.id) === true) {
            return;
        }

        var authorDisplayName = data.taggedMember.user.username + "#" + data.taggedMember.user.discriminator;
        var levelXP = data.serverConfig.module_level_level_exp;
        for(let i = 1; i < data.taggedServerUserConfig.level; i += 1) {
            levelXP *= data.serverConfig.module_level_level_multiplier;
        }

        //Changes user's level
        data.taggedServerUserConfig.xp += xpToAdd;
        var startLevel = data.taggedServerUserConfig.level;
        var rankMessage = "\n";
        var grantedRoles = [];
        var removedRoles = [];

        var processingRoles = [];
        var processRanks = async() => {
            if(data.serverConfig.module_level_ranks.length > 0 && data.guild.me.hasPermission("MANAGE_ROLES") === false) {
                var channel = await data.guild.channels.fetch(data.serverConfig.module_level_levelupMessages_channel).catch(e => { console.log(e); });
                channel.send("Ranks are setup, but the bot doesn't have required permissions - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                return;
            }

            data.serverConfig.module_level_ranks.forEach(function(rank) {
                if(rank.level <= data.taggedServerUserConfig.level) {
                    const role = data.guild.roles.cache.find(r =>
                        r.id === rank.roleID
                    );

                    if(data.taggedMember.roles.cache.has(rank.roleID) === false && processingRoles.includes(role.id) === false) {
                        data.taggedMember.roles.add(role).catch(err => { console.error(err) });
                        grantedRoles.push(role.name);
                        processingRoles.push(role.id);
                    }
                }

                if(data.taggedServerUserConfig.level < rank.level) {
                    const role = data.guild.roles.cache.find(r =>
                        r.id === rank.roleID
                    );

                    if(data.taggedMember.roles.cache.has(rank.roleID) === true && processingRoles.includes(role.id) === false) {
                        data.taggedMember.roles.remove(role).catch(err => { console.error(err) });
                        removedRoles.push(role.name);
                        processingRoles.push(role.id);
                    }
                }
            });
        }
        if(data.taggedServerUserConfig.xp < 0) {
            data.taggedServerUserConfig.xp = 0;
            data.taggedServerUserConfig.level = 1;

            await processRanks();
        }
        if(data.taggedServerUserConfig.xp >= levelXP) {
            while(data.taggedServerUserConfig.xp >= levelXP) {
                data.taggedServerUserConfig.xp -= levelXP;
                data.taggedServerUserConfig.level += 1;
                
                levelXP = data.serverConfig.module_level_level_exp;
                for(let i = 1; i < data.taggedServerUserConfig.level; i += 1) {
                    levelXP *= data.serverConfig.module_level_level_multiplier;
                }
            }

            await processRanks();
        }

        if(startLevel !== data.taggedServerUserConfig.level) {
            //Construct rank message
            var grantedRolesText = "";
            grantedRoles.forEach(function(roleName, index) {
                grantedRolesText += roleName;

                if(grantedRoles.length - 1 > index) {
                    grantedRolesText += ", ";
                }
            });

            var removedRolesText = "";
            removedRoles.forEach(function(roleName, index) {
                removedRolesText += roleName;

                if(removedRoles.length - 1 > index) {
                    removedRolesText += ", ";
                }
            });

            if(grantedRolesText != "") {
                rankMessage += "You've been granted role(s) `" + grantedRolesText + "`-\n";
                console.log("[server_leveling] Granted roles " + grantedRolesText + " to " + authorDisplayName + " on Server(id: " + data.guild.id + ")-");
            }

            if(removedRolesText != "") {
                rankMessage += "You've been removed role(s) `" + removedRolesText + "`-\n";
                console.log("[server_leveling] Removed roles " + removedRolesText + " from " + authorDisplayName + " on Server(id: " + data.guild.id + ")-");
            }

            //Construct levelup message
            var levelupMessage = data.serverConfig.module_level_levelupMessages_format;
            var authorName = data.serverConfig.module_level_levelupMessages_ping == true ? data.taggedMember : authorDisplayName;
            levelupMessage = levelupMessage.replace("%user%", authorName);
            levelupMessage = levelupMessage.replace("%level%", data.taggedServerUserConfig.level);

            //Send levelup message
            if(data.serverConfig.module_level_levelupMessages == true && sendLevelupMessage == true) {
                var channel = await data.guild.channels.fetch(data.serverConfig.module_level_levelupMessages_channel).catch(e => { console.log(e); });
                if(channel !== undefined) {
                    channel.send(levelupMessage + rankMessage).catch(e => { console.log(e); });
                }
            }
        }

        data.taggedServerUserConfig.rawXP += xpToAdd;
        data.taggedServerUserConfig.xp = Number(data.taggedServerUserConfig.xp.toFixed(2))

        //Saves user's config
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "serverUser", serverID: data.guild.id, userID: data.taggedMember.user.id, user: data.taggedServerUserConfig });
        //console.log("[server_leveling] Added " + messageXP + "xp to " + authorDisplayName + " on Server(id: " + msg.guild.id + ") (xp: " + authorConfig.xp + ")");
    }

    async updateGlobalLevel(data) {
        var authorDisplayName = data.authorUser.username + "#" + data.authorUser.discriminator;

        var messageXP = data.botConfig.messageXP;
        var levelXP = data.botConfig.levelXP;

        //Changes user's level
        data.authorConfig.xp += messageXP;

        if(data.authorConfig.xp > levelXP) {
            data.authorConfig.xp -= levelXP;
            data.authorConfig.level += 1;

            //Send levelup message
            data.channel.send("**" + authorDisplayName + "** is now global level " + data.authorConfig.level + "!").catch(e => { console.log(e); });
        }

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });
        //console.log("[global_leveling] Added " + messageXP + "xp to " + authorDisplayName + " (xp: " + authorConfig.xp + ")");
    }
}

module.exports = LevelingManager;