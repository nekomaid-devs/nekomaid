/* Types */
import { GlobalContext, GuildBanData, GuildMuteData } from "../../ts/base";

class ModerationManager {
    async timeout_all_mutes(global_context: GlobalContext) {
        const all_mutes = await global_context.neko_modules_clients.db.fetch_all_expired_mutes();
        all_mutes.forEach((mute) => {
            global_context.neko_modules_clients.moderationManager.timeout_mute(global_context, mute);
        });
    }

    async timeout_all_bans(global_context: GlobalContext) {
        const all_bans = await global_context.neko_modules_clients.db.fetch_all_expired_bans();
        all_bans.forEach((ban) => {
            global_context.neko_modules_clients.moderationManager.timeout_ban(global_context, ban);
        });
    }

    // TODO: add audit log for this
    async timeout_mute(global_context: GlobalContext, mute: GuildMuteData) {
        global_context.neko_modules_clients.db.remove_guild_mute(mute.id);

        const guild_data = await global_context.neko_modules_clients.db.fetch_guild(mute.guild_ID, false, false);
        if (guild_data === null || guild_data.mute_role_ID === null) {
            return;
        }

        const guild = await global_context.bot.guilds.fetch(mute.guild_ID);
        const member = await guild.members.fetch(mute.user_ID);

        member.roles.remove(guild_data.mute_role_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }

    // TODO: add audit log for this
    async timeout_ban(global_context: GlobalContext, ban: GuildBanData) {
        global_context.neko_modules_clients.db.remove_guild_ban(ban.id);

        const guild = await global_context.bot.guilds.fetch(ban.guild_ID);

        guild.members.unban(ban.user_ID).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
    }
}

export default ModerationManager;
