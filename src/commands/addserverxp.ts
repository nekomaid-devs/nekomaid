/* Types */
import { CommandData } from "../ts/types";
import { Permissions } from "discord.js";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";
import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "addserverxp",
    category: "Leveling",
    description: "Adds XP to the tagged user.",
    helpUsage: "[mention] [amount]`",
    exampleUsage: "/user_tag/ 100",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention"), new NeededArgument(2, "You need to type in an amount.", "float>0")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", Permissions.FLAGS.MANAGE_GUILD)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server. (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        const add_XP = parseFloat(command_data.args[1]);
        command_data.global_context.neko_modules_clients.levelingManager.update_server_level(command_data, add_XP);

        command_data.msg.channel.send(`Added \`${add_XP}\` XP to \`${command_data.tagged_user.tag}\`! (Current XP: \`${Math.round(command_data.tagged_server_user_config.xp)}\`)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
