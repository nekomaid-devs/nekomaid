/* Types */
import { CommandData, Command } from "../ts/base";
import { Permissions, TextChannel } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import Permission from "../scripts/helpers/permission";

export default {
    name: "addserverxp",
    category: "Leveling",
    description: "Adds XP to the tagged user.",
    helpUsage: "[mention] [amount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true), new Argument(2, "You need to type in an amount.", "float>0", true)],
    permissions: [new Permission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (!(command_data.message.channel instanceof TextChannel) || command_data.message.guild === null || command_data.message.member === null) {
            return;
        }
        if (command_data.guild_data.module_level_enabled === false) {
            command_data.message.reply(`Leveling isn't enabled on this server. (see \`${command_data.guild_data.prefix}leveling\` for help)`);
            return;
        }

        const add_XP = parseFloat(command_data.args[1]);
        command_data.global_context.neko_modules_clients.levelingManager.update_guild_level({
            global_context: command_data.global_context,

            guild: command_data.message.guild,
            guild_data: command_data.guild_data,
            channel: command_data.message.channel,
            member: command_data.message.member,
            user_data: command_data.user_guild_data,

            log: false,
            xp: add_XP,
        });

        command_data.message.channel.send(`Added \`${add_XP}\` XP to \`${command_data.tagged_user.tag}\`! (Current XP: \`${Math.round(command_data.tagged_user_guild_data.xp)}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
