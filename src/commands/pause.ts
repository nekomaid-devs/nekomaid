/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { AudioPlayerStatus } from "@discordjs/voice";

export default {
    name: "pause",
    category: "Music",
    description: "Pauses the current song",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
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
        const connection = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.message.guild.id);
        if (connection === undefined || connection.current === null) {
            command_data.message.reply("There's nothing playing!");
            return;
        }

        if (connection.player.state.status === AudioPlayerStatus.Playing) {
            connection.player.pause();
            command_data.message.channel.send("Paused current song.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.message.channel.send("The song is already paused.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
