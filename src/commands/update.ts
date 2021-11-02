/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

import NeededPermission from "../scripts/helpers/needed_permission";

export default {
    name: "update",
    category: "Testing",
    description: "Updates the bot's status.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const embedUpdate = {
            color: 8388736,
            description: "Updated bot's status",
            footer: { text: `Version: Nekomaid ${command_data.global_context.config.version}` },
        };

        command_data.msg.channel.send({ embeds: [embedUpdate] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        command_data.global_context.neko_modules_clients.web.refresh_status(command_data.global_context);
        command_data.global_context.neko_modules_clients.web.refresh_bot_list(command_data.global_context);
    },
} as Command;
