class LevelingManager {
    async update_server_level(command_data, xp_to_add, send_levelup_message = true) {
        if(isNaN(xp_to_add)) { return; }
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server", id: command_data.msg.guild.id, containRanks: true });
        if(command_data.server_config.module_level_ignored_channels.includes(command_data.msg.channel.id) === true) {
            return;
        }

        let level_XP = command_data.server_config.module_level_level_exp;
        for(let i = 1; i < command_data.tagged_server_user_config.level; i += 1) {
            level_XP *= command_data.server_config.module_level_level_multiplier;
        }

        command_data.tagged_server_user_config.xp += xp_to_add;
        if(Number.isSafeInteger(command_data.tagged_server_user_config.xp) === false) {
            command_data.tagged_server_user_config.xp = Number.MAX_SAFE_INTEGER;
        }

        let start_level = command_data.tagged_server_user_config.level;
        let rank_message = "\n";

        let processing_roles = [];
        let granted_roles = [];
        let removed_roles = [];

        let process_ranks = async() => {
            if(command_data.server_config.module_level_ranks.length > 0 && command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                let channel = await command_data.global_context.bot.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch(e => { command_data.global_context.logger.api_error(e); });
                if(channel !== undefined) {
                    channel.send("Ranks are setup, but the bot doesn't have required permissions - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { command_data.global_context.logger.api_error(e); });
                }
                return;
            }

            command_data.server_config.module_level_ranks.forEach((rank) => {
                let role = command_data.msg.guild.roles.cache.find(r => { return r.id === rank.role_ID });
                if(role !== undefined && processing_roles.includes(role.id) === false) {
                    if(rank.level <= command_data.tagged_server_user_config.level) {
                        command_data.tagged_member.roles.add(role).catch(e => { command_data.global_context.logger.api_error(e); });
                        granted_roles.push(role.name);
                        processing_roles.push(role.id);
                    }
    
                    if(command_data.tagged_server_user_config.level < rank.level) {
                        command_data.tagged_member.roles.remove(role).catch(e => { command_data.global_context.logger.api_error(e); });
                        removed_roles.push(role.name);
                        processing_roles.push(role.id);
                    }
                }
            });
        }
        if(command_data.tagged_server_user_config.xp < 0) {
            command_data.tagged_server_user_config.xp = 0;
            command_data.tagged_server_user_config.level = 1;

            await process_ranks();
        }
        if(command_data.tagged_server_user_config.xp >= level_XP) {
            while(command_data.tagged_server_user_config.xp >= level_XP) {
                command_data.tagged_server_user_config.xp -= level_XP;
                command_data.tagged_server_user_config.level += 1;
                
                level_XP = command_data.server_config.module_level_level_exp;
                for(let i = 1; i < command_data.tagged_server_user_config.level; i += 1) {
                    level_XP *= command_data.server_config.module_level_level_multiplier;
                }
            }

            await process_ranks();
        }

        if(start_level !== command_data.tagged_server_user_config.level) {
            let granted_roles_text = granted_roles.reduce((acc, curr) => { acc += "`" + curr.toString() + "`, "; return acc; }, "");
            granted_roles_text = granted_roles_text.slice(0, granted_roles_text.length - 2);
            if(granted_roles_text === "") {
                granted_roles_text = "`None`";
            }

            let removed_roles_text = removed_roles.reduce((acc, curr) => { acc += "`" + curr.toString() + "`, "; return acc; }, "");
            removed_roles_text = removed_roles_text.slice(0, removed_roles_text.length - 2);
            if(removed_roles_text === "") {
                removed_roles_text = "`None`";
            }

            if(granted_roles_text !== "`None`") {
                rank_message += `You've been granted role(s) \`${granted_roles_text}\`-\n`;
            }
            if(removed_roles_text !== "`None`") {
                rank_message += `You've been removed role(s) \`${removed_roles_text}\`-\n`;
            }

            if(command_data.server_config.module_level_levelup_messages == true && send_levelup_message == true) {
                var levelup_message = command_data.server_config.module_level_levelup_messages_format;
                levelup_message = levelup_message.replace("<user>", (command_data.server_config.module_level_levelup_messages_ping == true ? command_data.tagged_user : command_data.tagged_user.tag));
                levelup_message = levelup_message.replace("<level>", command_data.tagged_server_user_config.level);

                let channel = await command_data.msg.guild.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch(e => { command_data.global_context.logger.api_error(e); });
                if(channel !== undefined) {
                    channel.send(levelup_message + rank_message).catch(e => { command_data.global_context.logger.api_error(e); });
                }
            }
        }

        command_data.tagged_server_user_config.xp = Number(command_data.tagged_server_user_config.xp.toFixed(2));
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server_user", server_ID: command_data.msg.guild.id, user_ID: command_data.tagged_member.user.id, user: command_data.tagged_server_user_config });
    }

    async update_global_level(command_data) {
        var message_XP = command_data.global_context.bot_config.message_XP;
        var level_XP = command_data.global_context.bot_config.level_XP;

        command_data.author_config.xp += message_XP;
        if(command_data.author_config.xp > level_XP) {
            command_data.author_config.xp -= level_XP;
            command_data.author_config.level += 1;
        }

        command_data.author_config.xp = Number(command_data.author_config.xp.toFixed(2));
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });
    }
}

module.exports = LevelingManager;