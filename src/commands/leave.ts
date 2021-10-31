/* Types */
import { CommandData } from "../ts/types";

export default {
    name: "leave",
    category: "Music",
    description: "Leaves the voice channel.",
    helpUsage: "`",
    hidden: false,
    aliases: ["stop"],
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
        // TODO: check for guild voice aswell
        if (command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false) {
            command_data.msg.reply("I'm not in a voice channel.");
            return;
        }

        command_data.global_context.neko_modules_clients.voiceManager.remove_connection(command_data.global_context, command_data.msg.guild.id);
        command_data.msg.channel.send("Left the voice channel.").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
