/* Types */
import { CommandData, Command, UserGuildData } from "../ts/base";
import { Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import Permission from "../scripts/helpers/permission";

export default {
    name: "clearserverxp",
    category: "Leveling",
    description: "Resets XP of everybody in the server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.guild_data.module_level_enabled === false) {
            command_data.message.reply(`Leveling isn't enabled on this server. (see \`${command_data.guild_data.prefix}leveling\` for help)`);
            return;
        }

        const user_guild_datas = await command_data.global_context.neko_modules_clients.db.fetch_guild_users(command_data.message.guild.id);
        user_guild_datas.forEach(async (user_guild_data: UserGuildData) => {
            if (!(command_data.message.channel instanceof TextChannel) || command_data.message.guild === null || command_data.message.member === null) {
                return;
            }
            user_guild_data.level = 1;
            user_guild_data.xp = 0;

            // TODO: this won't work
            if ((await command_data.message.guild.members.fetch()).has(user_guild_data.user_ID) === true) {
                const member = await command_data.message.guild.members.fetch(user_guild_data.user_ID).catch((e: Error) => {
                    command_data.global_context.logger.api_error(e);
                    return null;
                });
                if (member === null) {
                    return;
                }

                command_data.tagged_user_guild_data = user_guild_data;
                command_data.tagged_member = member;
                command_data.global_context.neko_modules_clients.levelingManager.update_guild_level({
                    global_context: command_data.global_context,

                    guild: command_data.message.guild,
                    guild_data: command_data.guild_data,
                    channel: command_data.message.channel,
                    member: command_data.message.member,
                    user_data: command_data.user_guild_data,

                    log: false,
                    xp: 0,
                });
            }
        });

        command_data.message.channel.send(`Cleared XP of \`${user_guild_datas.length}\` users.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
