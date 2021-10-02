class ReactionRolesManager {
    async create_all_collectors(global_context) {
        let reaction_roles = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "all_reaction_roles" });
        global_context.bot.guilds.cache.forEach(server => {
            let server_reaction_roles = reaction_roles.filter(e => { return e.server_ID === server.id; });
            server_reaction_roles.forEach(rr => {
                global_context.neko_modules_clients.rrm.create_collector(global_context, server, rr);
            });
        });
    }

    async create_collector(global_context, server, rr) {
        let channel = await global_context.bot.channels.fetch(rr.channel_ID).catch(e => { global_context.logger.api_error(e); });
        if(channel !== undefined) {
            let message = await channel.messages.fetch(rr.message_ID).catch(e => { global_context.logger.api_error(e); });
            if(message !== undefined) {
                let filter = (r, u) => u.bot === false
                let collector = message.createReactionCollector(filter, { dispose: true })
                collector.on('collect', (r, user) => {
                    rr.reaction_roles.forEach(async(role_ID, i) => {
                        let emoji = rr.reaction_role_emojis[i];
                        if((emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === "<:" + r.emoji.name + ":" + r.emoji.id + ">"))) {
                            await global_context.utils.verify_guild_members(server);
                            await global_context.utils.verify_guild_roles(server);

                            let member = Array.from(server.members.cache.values()).find(e => { return e.user.id === user.id; })
                            if(member !== undefined) {
                                let role = Array.from(server.roles.cache.values()).find(e => { return e.id === role_ID; });
                                if(role !== undefined) {
                                    member.roles.add(role).catch(e => { global_context.logger.api_error(e); });
                                }
                            }
                        }
                    });
                });

                collector.on('remove', (r, user) => {
                    rr.reaction_roles.forEach(async(role_ID, i) => {
                        let emoji = rr.reaction_role_emojis[i];
                        if((emoji === r.emoji.name || (r.emoji.id !== undefined && emoji === "<:" + r.emoji.name + ":" + r.emoji.id + ">"))) {
                            await global_context.utils.verify_guild_members(server);
                            await global_context.utils.verify_guild_roles(server);

                            let member = Array.from(server.members.cache.values()).find(e => { return e.user.id === user.id; })
                            if(member !== undefined) {
                                let role = Array.from(server.roles.cache.values()).find(e => { return e.id === role_ID; });
                                if(role !== undefined) {
                                    member.roles.remove(role).catch(e => { global_context.logger.api_error(e); });
                                }
                            }
                        }
                    });
                });
            }
        }
    }
}

module.exports = ReactionRolesManager;
