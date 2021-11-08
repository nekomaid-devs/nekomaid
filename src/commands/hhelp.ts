/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "hhelp",
    category: "Utility",
    description: ".",
    helpUsage: "`",
    exampleUsage: "",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        command_data.message.channel.send("Help yourself...").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
