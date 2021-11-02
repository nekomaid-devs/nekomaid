/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions } from "discord.js";

/* Local Imports */
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "clearserverxp",
    category: "Leveling",
    description: "Resets XP of everybody in the server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server. (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        const server_user_configs = await command_data.global_context.neko_modules_clients.mySQL.fetch(command_data.global_context, { type: "all_server_users", id: command_data.msg.guild.id });
        server_user_configs.forEach(async (server_user_config: any) => {
            if (command_data.msg.guild === null) {
                return;
            }
            server_user_config.level = 1;
            server_user_config.xp = 0;

            //TODO: this won't work
            if (command_data.msg.guild.members.cache.has(server_user_config.user_ID) === true) {
                const member = await command_data.msg.guild.members.fetch(server_user_config.user_ID).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                    return null;
                });
                if (member === null) {
                    return;
                }

                command_data.tagged_server_user_config = server_user_config;
                command_data.tagged_member = member;
                command_data.global_context.neko_modules_clients.levelingManager.update_server_level(command_data, 0);
            }
        });

        command_data.msg.channel.send(`Cleared XP of \`${server_user_configs.length}\` users.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
