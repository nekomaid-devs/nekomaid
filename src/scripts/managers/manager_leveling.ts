/* Types */
import { RankData } from "../../ts/base";
import { GuildLevelingData, LevelingData } from "../../ts/leveling";
import { Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import { get_guild_level_XP } from "../utils/util_general";

class LevelingManager {
    async update_guild_level(leveling_data: GuildLevelingData) {
        if (leveling_data.guild_data.module_level_ignored_channels.includes(leveling_data.channel.id) === true) {
            return;
        }

        let level_XP = get_guild_level_XP(leveling_data.guild_data, leveling_data.user_data);
        leveling_data.user_data.xp += leveling_data.xp;

        if (leveling_data.user_data.xp < 0) {
            leveling_data.user_data.xp = 0;
            leveling_data.user_data.level = 1;
        } else if (leveling_data.user_data.xp >= level_XP) {
            while (leveling_data.user_data.xp >= level_XP) {
                leveling_data.user_data.xp -= level_XP;
                leveling_data.user_data.level += 1;

                level_XP = get_guild_level_XP(leveling_data.guild_data, leveling_data.user_data);
            }
        }

        leveling_data.user_data.xp = Number(leveling_data.user_data.xp.toFixed(2));
        leveling_data.global_context.neko_modules_clients.db.edit_guild_user(leveling_data.user_data);

        const rank_data = await this.process_ranks(leveling_data);
        if (leveling_data.guild_data.module_level_levelup_messages === true && leveling_data.log === true) {
            const granted_roles_text = rank_data.granted_roles
                .reduce((acc, curr) => {
                    return `${acc}\`${curr.toString()}\`, `;
                }, "")
                .slice(0, -2);
            const removed_roles_text = rank_data.removed_roles
                .reduce((acc, curr) => {
                    return `${acc}\`${curr.toString()}\`, `;
                }, "")
                .slice(0, -2);

            let rank_message = "\n";
            if (granted_roles_text !== "") {
                rank_message += `You've been granted role(s) \`${granted_roles_text}\`!\n`;
            }
            if (removed_roles_text !== "") {
                rank_message += `You've been removed role(s) \`${removed_roles_text}\`.\n`;
            }

            let levelup_message = leveling_data.guild_data.module_level_levelup_messages_format;
            levelup_message = levelup_message.replace("<user>", leveling_data.guild_data.module_level_levelup_messages_ping === true ? leveling_data.member.toString() : leveling_data.member.user.tag);
            levelup_message = levelup_message.replace("<level>", leveling_data.user_data.level.toString());

            const channel = await leveling_data.global_context.bot.channels.fetch(leveling_data.guild_data.module_level_levelup_messages_channel).catch((e: Error) => {
                leveling_data.global_context.logger.api_error(e);
                return null;
            });
            if (channel instanceof TextChannel) {
                channel.send(levelup_message + rank_message).catch((e: Error) => {
                    leveling_data.global_context.logger.api_error(e);
                });
            }
        }

        leveling_data.user_data.xp = Number(leveling_data.user_data.xp.toFixed(2));
        leveling_data.global_context.neko_modules_clients.db.edit_guild_user(leveling_data.user_data);
    }

    async process_ranks(leveling_data: GuildLevelingData) {
        if (leveling_data.guild_data.module_level_ranks === null || leveling_data.guild.me === null) {
            return { granted_roles: [], removed_roles: [] };
        }
        if (leveling_data.guild_data.module_level_ranks.length > 0 && leveling_data.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) === false) {
            const channel = await leveling_data.global_context.bot.channels.fetch(leveling_data.guild_data.module_level_levelup_messages_channel).catch((e: Error) => {
                leveling_data.global_context.logger.api_error(e);
                return null;
            });
            if (channel !== null && channel instanceof TextChannel) {
                channel.send("Ranks are setup, but the bot doesn't have required permissions - `Manage Roles`\nPlease add required permissions and try again-").catch((e: Error) => {
                    leveling_data.global_context.logger.api_error(e);
                });
            }

            return { granted_roles: [], removed_roles: [] };
        }

        const processed_roles: string[] = [];
        const granted_roles: string[] = [];
        const removed_roles: string[] = [];
        leveling_data.guild_data.module_level_ranks.forEach((rank: RankData) => {
            const role = leveling_data.guild.roles.cache.find((r) => {
                return r.id === rank.role_ID;
            });
            if (role === undefined || processed_roles.includes(role.id)) {
                return;
            }

            if (rank.level <= leveling_data.user_data.level) {
                leveling_data.member.roles.add(role).catch((e: Error) => {
                    leveling_data.global_context.logger.api_error(e);
                });
                granted_roles.push(role.name);
                processed_roles.push(role.id);
            }
            if (leveling_data.user_data.level < rank.level) {
                leveling_data.member.roles.remove(role).catch((e: Error) => {
                    leveling_data.global_context.logger.api_error(e);
                });
                removed_roles.push(role.name);
                processed_roles.push(role.id);
            }
        });

        return {
            granted_roles: granted_roles,
            removed_roles: removed_roles,
        };
    }

    update_global_level(leveling_data: LevelingData) {
        const message_XP = leveling_data.bot_data.message_XP;
        const level_XP = leveling_data.bot_data.level_XP;

        leveling_data.user_data.xp += message_XP;
        if (leveling_data.user_data.xp > level_XP) {
            leveling_data.user_data.xp -= level_XP;
            leveling_data.user_data.level += 1;
        }

        leveling_data.user_data.xp = Number(leveling_data.user_data.xp.toFixed(2));
        leveling_data.global_context.neko_modules_clients.db.edit_user(leveling_data.user_data);
    }
}

export default LevelingManager;
