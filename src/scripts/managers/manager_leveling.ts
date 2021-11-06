/* Types */
import { CommandData, RankData } from "../../ts/base";
import { Permissions, TextChannel } from "discord.js";

/* Local Imports */
import { get_server_level_XP } from "../utils/util_general";

class LevelingManager {
    async update_server_level(command_data: CommandData, xp: number, log: boolean) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.server_config.module_level_ignored_channels.includes(command_data.msg.channel.id) === true) {
            return;
        }

        let level_XP = get_server_level_XP(command_data.server_config, command_data.tagged_server_user_config);
        command_data.tagged_server_user_config.xp += xp;

        if (command_data.tagged_server_user_config.xp < 0) {
            command_data.tagged_server_user_config.xp = 0;
            command_data.tagged_server_user_config.level = 1;
        } else if (command_data.tagged_server_user_config.xp >= level_XP) {
            while (command_data.tagged_server_user_config.xp >= level_XP) {
                command_data.tagged_server_user_config.xp -= level_XP;
                command_data.tagged_server_user_config.level += 1;

                level_XP = get_server_level_XP(command_data.server_config, command_data.tagged_server_user_config);
            }
        }

        command_data.tagged_server_user_config.xp = Number(command_data.tagged_server_user_config.xp.toFixed(2));
        command_data.global_context.neko_modules_clients.db.edit_server_user(command_data.tagged_server_user_config);
        if (command_data.server_config.module_level_ranks.length < 1) {
            return;
        }

        const rank_data = await this.process_ranks(command_data);
        if (command_data.server_config.module_level_levelup_messages === true && log === true) {
            let granted_roles_text = rank_data.granted_roles.reduce((acc, curr) => {
                acc += `\`${curr.toString()}\`, `;
                return acc;
            }, "");
            granted_roles_text = granted_roles_text.slice(0, granted_roles_text.length - 2);
            if (granted_roles_text === "") {
                granted_roles_text = "`None`";
            }

            let removed_roles_text = rank_data.removed_roles.reduce((acc, curr) => {
                acc += `\`${curr.toString()}\`, `;
                return acc;
            }, "");
            removed_roles_text = removed_roles_text.slice(0, removed_roles_text.length - 2);
            if (removed_roles_text === "") {
                removed_roles_text = "`None`";
            }

            let rank_message = "\n";
            if (granted_roles_text !== "`None`") {
                rank_message += `You've been granted role(s) \`${granted_roles_text}\`!\n`;
            }
            if (removed_roles_text !== "`None`") {
                rank_message += `You've been removed role(s) \`${removed_roles_text}\`.\n`;
            }

            let levelup_message = command_data.server_config.module_level_levelup_messages_format;
            levelup_message = levelup_message.replace("<user>", command_data.server_config.module_level_levelup_messages_ping === true ? command_data.tagged_user.toString() : command_data.tagged_user.tag);
            levelup_message = levelup_message.replace("<level>", command_data.tagged_server_user_config.level.toString());

            const channel = await command_data.global_context.bot.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (channel === null || !(channel instanceof TextChannel)) {
                return;
            }

            channel.send(levelup_message + rank_message).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }

        command_data.tagged_server_user_config.xp = Number(command_data.tagged_server_user_config.xp.toFixed(2));
        command_data.global_context.neko_modules_clients.db.edit_server_user(command_data.tagged_server_user_config);
    }

    async process_ranks(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.msg.guild.me === null) {
            return { granted_roles: [], removed_roles: [] };
        }
        if (command_data.server_config.module_level_ranks.length > 0 && command_data.msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) === false) {
            const channel = await command_data.global_context.bot.channels.fetch(command_data.server_config.module_level_levelup_messages_channel).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (channel !== null && channel instanceof TextChannel) {
                channel.send("Ranks are setup, but the bot doesn't have required permissions - `Manage Roles`\nPlease add required permissions and try again-").catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
            }

            return { granted_roles: [], removed_roles: [] };
        }

        const processed_roles: string[] = [];
        const granted_roles: string[] = [];
        const removed_roles: string[] = [];
        command_data.server_config.module_level_ranks.forEach((rank: RankData) => {
            if (command_data.msg.guild === null) {
                return;
            }
            const role = command_data.msg.guild.roles.cache.find((r) => {
                return r.id === rank.role_ID;
            });
            if (role === undefined || processed_roles.includes(role.id)) {
                return;
            }

            if (rank.level <= command_data.tagged_server_user_config.level) {
                command_data.tagged_member.roles.add(role).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                });
                granted_roles.push(role.name);
                processed_roles.push(role.id);
            }
            if (command_data.tagged_server_user_config.level < rank.level) {
                command_data.tagged_member.roles.remove(role).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
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

    update_global_level(command_data: CommandData) {
        if (command_data.global_context.bot_config === null) {
            return;
        }

        const message_XP = command_data.global_context.bot_config.message_XP;
        const level_XP = command_data.global_context.bot_config.level_XP;

        command_data.author_user_config.xp += message_XP;
        if (command_data.author_user_config.xp > level_XP) {
            command_data.author_user_config.xp -= level_XP;
            command_data.author_user_config.level += 1;
        }

        command_data.author_user_config.xp = Number(command_data.author_user_config.xp.toFixed(2));
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.author_user_config);
    }
}

export default LevelingManager;
