import { CommandData } from "../ts/types";

export default {
    name: "hhelp",
    category: "Utility",
    description: ".",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        command_data.msg.channel.send("Help yourself...").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
