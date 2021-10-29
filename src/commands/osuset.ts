import { CommandData } from "../ts/types";

import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "osuset",
    category: "Utility",
    description: "Sets user's osu! acount.",
    helpUsage: "[osuUsername]`",
    exampleUsage: "chocomint",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in an osu! username.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        if (command_data.global_context.config.osu_enabled === false) {
            command_data.msg.channel.send("The osu! module is disabled for this bot.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            return;
        }

        const user = await command_data.global_context.modules_clients.osu.getUser({ u: command_data.total_argument }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        if (user.id === undefined) {
            command_data.msg.reply(`Haven't found any osu! account with username \`${command_data.total_argument}\`!`);
            return;
        }

        command_data.author_user_config.osu_username = command_data.total_argument;
        command_data.global_context.neko_modules_clients.mySQL.edit(command_data.global_context, { type: "global_user", user: command_data.author_user_config });

        command_data.msg.channel.send(`Set osu! username to \`${command_data.total_argument}\`.`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
