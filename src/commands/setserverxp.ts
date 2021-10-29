import { CommandData } from "../ts/types";

import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";
import { Permissions } from "discord.js";

export default {
    name: "setserverxp",
    category: "Leveling",
    description: "Sets XP of tagged user.",
    helpUsage: "[mention] [amount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention"), new NeededArgument(1, "You need to type in an amount.", "float>0")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        // TODO: add limit to this (+ check type)
        if (command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server. (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        const set_XP = parseFloat(command_data.args[1]);
        command_data.tagged_server_user_config.level = 1;
        command_data.tagged_server_user_config.xp = 0;
        command_data.global_context.neko_modules_clients.levelingManager.update_server_level(command_data, set_XP);

        command_data.msg.channel.send(`Set \`${set_XP}\` XP to \`${command_data.tagged_user.tag}\`! (Current XP: \`${Math.round(command_data.tagged_server_user_config.xp)}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
