/* Types */
import { CommandData } from "../ts/types";

export default {
    name: "repeat",
    category: "Music",
    description: "Repeats the current queue of songs.",
    helpUsage: "`",
    hidden: false,
    aliases: ["loop"],
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
        if (
            command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false ||
            command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id).current === -1
        ) {
            command_data.msg.reply("There's nothing playing!");
            return;
        }

        const voice_data = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        voice_data.mode = voice_data.mode === 0 ? 1 : 0;
        if (voice_data.mode === 1) {
            command_data.msg.channel.send("Repeating current queue.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.msg.channel.send("Stopped repeating current queue.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
