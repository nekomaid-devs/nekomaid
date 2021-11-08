/* Types */
import { GlobalContext, GuildBanData, GuildMuteData } from "../../ts/base";
import { Guild } from "discord.js-light";

class ModerationManager {
    async timeout_all_mutes(global_context: GlobalContext) {
        const all_mutes = await global_context.neko_modules_clients.db.fetch_all_expired_mutes();
        global_context.bot.guilds.cache.forEach((guild) => {
            const guild_mutes = all_mutes.filter((e: GuildMuteData) => {
                return e.id === guild.id;
            });
            global_context.neko_modules_clients.moderationManager.timeout_mutes(global_context, guild, guild_mutes);
        });
    }

    async timeout_all_bans(global_context: GlobalContext) {
        const all_bans = await global_context.neko_modules_clients.db.fetch_all_expired_bans();
        global_context.bot.guilds.cache.forEach((guild) => {
            const guild_bans = all_bans.filter((e: GuildBanData) => {
                return e.id === guild.id;
            });
            global_context.neko_modules_clients.moderationManager.timeout_bans(global_context, guild, guild_bans);
        });
    }

    // TODO: add audit log for this
    async timeout_mutes(global_context: GlobalContext, guild: Guild, guild_mutes: GuildMuteData[]) {
        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(guild.id, false, false);
        if (guild_data === null) {
            return;
        }
        guild_mutes.forEach((mute) => {
            if (guild_data.mute_role_ID === null) {
                return;
            }
            global_context.neko_modules_clients.db.remove_guild_mute(mute.id);

            const member = Array.from(guild.members.cache.values()).find((e) => {
                return e.user.id === mute.user_ID;
            });
            if (member === undefined) {
                return;
            }

            member.roles.remove(guild_data.mute_role_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        });
    }

    // TODO: add audit log for this
    timeout_bans(global_context: GlobalContext, guild: Guild, guild_bans: GuildBanData[]) {
        /*
         * const guild_data = await global_context.neko_modules_clients.mySQL.fetch_guild(guild.id, GuildFetchType.ALL, false, false);
         * if(guild_data === null) { return; }
         */
        guild_bans.forEach((ban) => {
            global_context.neko_modules_clients.db.remove_guild_ban(ban.id);

            guild.members.unban(ban.user_ID).catch((e: Error) => {
                global_context.logger.api_error(e);
            });
        });
    }
}

export default ModerationManager;
