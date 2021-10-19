class ModerationManager {
    async timeout_all_mutes(global_context) {
        let now = Date.now();
        let all_mutes = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "expired_server_mutes", time: now });
        global_context.bot.guilds.cache.forEach((server) => {
            let server_mutes = all_mutes.filter((e) => {
                return e.server_ID === server.id;
            })[0];
            if (server_mutes !== undefined) {
                global_context.neko_modules_clients.moderator.timeout_mutes(global_context, server, server_mutes);
            }
        });
    }

    async timeout_all_bans(global_context) {
        let now = Date.now();
        let all_bans = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "expired_server_bans", time: now });
        global_context.bot.guilds.cache.forEach((server) => {
            let server_bans = all_bans.filter((e) => {
                return e.server_ID === server.id;
            })[0];
            if (server_bans !== undefined) {
                global_context.neko_modules_clients.moderator.timeout_bans(global_context, server, server_bans);
            }
        });
    }

    // TODO: add audit log for this
    async timeout_mutes(global_context, server, server_mutes) {
        await global_context.utils.verify_guild_members(server);
        let server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server", id: server.id });
        server_mutes.forEach((mute) => {
            global_context.neko_modules_clients.ssm.server_remove.remove_server_mute(global_context, mute.id);

            let member = Array.from(server.members.cache.values()).find((e) => {
                return e.user.id === mute.user_ID;
            });
            if (member !== undefined) {
                member.roles.remove(server_config.mute_role_ID).catch((e) => {
                    global_context.logger.api_error(e);
                });
            }
        });
    }

    // TODO: add audit log for this
    async timeout_bans(global_context, server, server_bans) {
        await global_context.utils.verify_guild_members(server);
        server_bans.forEach((ban) => {
            global_context.neko_modules_clients.ssm.server_remove.remove_server_ban(global_context, ban.id);

            server.members.unban(ban.user_ID).catch((e) => {
                global_context.logger.api_error(e);
            });
        });
    }
}

module.exports = ModerationManager;
