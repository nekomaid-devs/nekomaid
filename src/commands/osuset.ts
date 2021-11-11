/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "osuset",
    category: "Utility",
    description: "Sets user's osu! acount.",
    helpUsage: "[osuUsername]`",
    exampleUsage: "chocomint",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in an osu! username.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.global_context.modules_clients.osu === null) {
            command_data.message.channel.send("The osu! module is disabled for this bot.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.total_argument }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (user === null) {
            command_data.message.reply(`Haven't found any osu! account with username \`${command_data.total_argument}\`!`);
            return;
        }

        command_data.user_data.osu_username = command_data.total_argument;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        command_data.message.channel.send(`Set osu! username to \`${command_data.total_argument}\`.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
