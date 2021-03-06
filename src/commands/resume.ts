/* Types */
import { CommandData, Command } from "../ts/base";

/* Node Imports */
import { AudioPlayerStatus } from "@discordjs/voice";

export default {
    name: "resume",
    category: "Music",
    description: "Resumes the current song",
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

        if (connection.player.state.status === AudioPlayerStatus.Paused) {
            connection.player.unpause();
            command_data.message.channel.send("Resumed current song.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.message.channel.send("The song is already resumed.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
