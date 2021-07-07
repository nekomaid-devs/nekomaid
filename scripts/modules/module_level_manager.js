class LevelingManager {
    /*async updateServerLevel(data, xpToAdd, sendLevelupMessage = true) {
        if(data.msg.author.bot === true || command_data.server_config.module_level_enabled == false) {
            return;
        }
        
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(data.bot, { type: "server", id: data.msg.guild.id, containRanks: true });
        if(command_data.server_config.module_level_ignoredChannels.includes(data.msg.channel.id) === true) {
            return;
        }

        var authorDisplayName = command_data.tagged_member.user.username + "#" + command_data.tagged_member.user.discriminator;
        var levelXP = command_data.server_config.module_level_level_exp;
        for(let i = 1; i < data.taggedServerUserConfig.level; i += 1) {
            levelXP *= command_data.server_config.module_level_level_multiplier;
        }

        //Changes user's level
        data.taggedServerUserConfig.xp += xpToAdd;
        var startLevel = data.taggedServerUserConfig.level;
        var rankMessage = "\n";
        var grantedRoles = [];
        var removedRoles = [];

        var processingRoles = [];
        var processRanks = async() => {
            if(command_data.server_config.module_level_ranks.length > 0 && command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                var channel = await command_data.msg.guild.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch(e => { console.log(e); });
                channel.send("Ranks are setup, but the bot doesn't have required permissions - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                return;
            }

            command_data.server_config.module_level_ranks.forEach(function(rank) {
                if(rank.level <= data.taggedServerUserConfig.level) {
                    const role = command_data.msg.guild.roles.cache.find(r =>
                        r.id === rank.roleID
                    );

                    if(command_data.tagged_member.roles.cache.has(rank.roleID) === false && processingRoles.includes(role.id) === false) {
                        command_data.tagged_member.roles.add(role).catch(err => { console.error(err) });
                        grantedRoles.push(role.name);
                        processingRoles.push(role.id);
                    }
                }

                if(data.taggedServerUserConfig.level < rank.level) {
                    const role = command_data.msg.guild.roles.cache.find(r =>
                        r.id === rank.roleID
                    );

                    if(command_data.tagged_member.roles.cache.has(rank.roleID) === true && processingRoles.includes(role.id) === false) {
                        command_data.tagged_member.roles.remove(role).catch(err => { console.error(err) });
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
                
                levelXP = command_data.server_config.module_level_level_exp;
                for(let i = 1; i < data.taggedServerUserConfig.level; i += 1) {
                    levelXP *= command_data.server_config.module_level_level_multiplier;
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
                console.log("[server_leveling] Granted roles " + grantedRolesText + " to " + authorDisplayName + " on Server(id: " + command_data.msg.guild.id + ")-");
            }

            if(removedRolesText != "") {
                rankMessage += "You've been removed role(s) `" + removedRolesText + "`-\n";
                console.log("[server_leveling] Removed roles " + removedRolesText + " from " + authorDisplayName + " on Server(id: " + command_data.msg.guild.id + ")-");
            }

            //Construct levelup message
            var levelupMessage = command_data.server_config.module_level_levelupMessages_format;
            var authorName = command_data.server_config.module_level_levelupMessages_ping == true ? command_data.tagged_member : authorDisplayName;
            levelupMessage = levelupMessage.replace("%user%", authorName);
            levelupMessage = levelupMessage.replace("%level%", data.taggedServerUserConfig.level);

            //Send levelup message
            if(command_data.server_config.module_level_levelupMessages == true && sendLevelupMessage == true) {
                var channel = await command_data.msg.guild.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch(e => { console.log(e); });
                if(channel !== undefined) {
                    channel.send(levelupMessage + rankMessage).catch(e => { console.log(e); });
                }
            }
        }

        data.taggedServerUserConfig.rawXP += xpToAdd;
        data.taggedServerUserConfig.xp = Number(data.taggedServerUserConfig.xp.toFixed(2))

        //Saves user's config
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "serverUser", serverID: command_data.msg.guild.id, userID: command_data.tagged_member.user.id, user: data.taggedServerUserConfig });
        //console.log("[server_leveling] Added " + messageXP + "xp to " + authorDisplayName + " on Server(id: " + msg.guild.id + ") (xp: " + authorConfig.xp + ")");
    }

    async updateGlobalLevel(data) {
        var authorDisplayName = command_data.msg.author.username + "#" + command_data.msg.author.discriminator;

        var messageXP = command_data.global_context.bot_config.messageXP;
        var levelXP = command_data.global_context.bot_config.levelXP;

        //Changes user's level
        command_data.author_config.xp += messageXP;

        if(command_data.author_config.xp > levelXP) {
            command_data.author_config.xp -= levelXP;
            command_data.author_config.level += 1;

            //Send levelup message
            command_data.msg.channel.send("**" + authorDisplayName + "** is now global level " + command_data.author_config.level + "!").catch(e => { console.log(e); });
        }

        //Edits and broadcasts the change
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });
        //console.log("[global_leveling] Added " + messageXP + "xp to " + authorDisplayName + " (xp: " + authorConfig.xp + ")");
    }*/
}

module.exports = LevelingManager;