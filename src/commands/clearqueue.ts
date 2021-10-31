/* Types */
import { CommandData } from "../ts/types";

export default {
    name: "clearqueue",
    category: "Music",
    description: "Clears the current queue.",
    helpUsage: "`",
    hidden: false,
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
        // TODO: this should skip the current song
        if (command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false) {
            command_data.msg.reply("I'm not in a voice channel.");
            return;
        }

        const voice_data = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        voice_data.queue = [];
        voice_data.persistent_queue = [];

        command_data.msg.channel.send("Cleared the current queue.").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
