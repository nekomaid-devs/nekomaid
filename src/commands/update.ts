/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

/* Local Imports */
import Permission from "../scripts/helpers/permission";
import { refresh_bot_list, refresh_status } from "../scripts/utils/web";

export default {
    name: "update",
    category: "Testing",
    description: "Updates the bot's status.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [new Permission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const embedUpdate = {
            color: 8388736,
            description: "Updated bot's status",
            footer: { text: `Version: Nekomaid ${command_data.global_context.config.version}` },
        };

        command_data.message.channel.send({ embeds: [embedUpdate] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });

        refresh_status(command_data.global_context);
        refresh_bot_list(command_data.global_context);
    },
} as Command;
