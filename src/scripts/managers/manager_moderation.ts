/* Types */
import { GlobalContext, ServerBanData, ServerMuteData } from "../../ts/base";
import { GuildFetchType } from "../db/db_utils";
import { Guild } from "discord.js";

class ModerationManager {
    async timeout_all_mutes(global_context: GlobalContext) {
        const all_mutes = await global_context.neko_modules_clients.db.fetch_all_expired_mutes();
        global_context.bot.guilds.cache.forEach((server) => {
            const server_mutes = all_mutes.filter((e: ServerMuteData) => {
                return e.server_ID === server.id;
            });
            global_context.neko_modules_clients.moderationManager.timeout_mutes(global_context, server, server_mutes);
        });
    }

    async timeout_all_bans(global_context: GlobalContext) {
        const all_bans = await global_context.neko_modules_clients.db.fetch_all_expired_bans();
        global_context.bot.guilds.cache.forEach((server) => {
            const server_bans = all_bans.filter((e: ServerBanData) => {
                return e.server_ID === server.id;
            });
            global_context.neko_modules_clients.moderationManager.timeout_bans(global_context, server, server_bans);
        });
    }

    // TODO: add audit log for this
    async timeout_mutes(global_context: GlobalContext, server: Guild, server_mutes: ServerMuteData[]) {
        const server_config = await global_context.neko_modules_clients.db.fetch_server(server.id, GuildFetchType.ALL, false, false);
        if (server_config === null) {
            return;
        }
        server_mutes.forEach((mute) => {
            if (server_config.mute_role_ID === null) {
                return;
            }
            global_context.neko_modules_clients.db.remove_server_mute(mute.id);

            const member = Array.from(server.members.cache.values()).find((e) => {
                return e.user.id === mute.user_ID;
            });
            if (member === undefined) {
                return;
            }

            member.roles.remove(server_config.mute_role_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        });
    }

    // TODO: add audit log for this
    async timeout_bans(global_context: GlobalContext, server: Guild, server_bans: ServerBanData[]) {
        //const server_config = await global_context.neko_modules_clients.mySQL.fetch_server(server.id, GuildFetchType.ALL, false, false);
        //if(server_config === null) { return; }
        server_bans.forEach((ban) => {
            global_context.neko_modules_clients.db.remove_server_ban(ban.id);

            server.members.unban(ban.user_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        });
    }
}

export default ModerationManager;
