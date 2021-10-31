/* Types */
import { CommandData } from "../ts/types";

export default {
    name: "resume",
    category: "Music",
    description: "Resumes the current song",
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
        if (
            command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false ||
            command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id).current === -1
        ) {
            command_data.msg.reply("There's nothing playing!");
            return;
        }

        const voice_data = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        if (voice_data.connection.dispatcher.paused === true) {
            voice_data.connection.dispatcher.resume();
            command_data.msg.channel.send("Resumed current song.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.msg.channel.send("The song is already resumed.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
