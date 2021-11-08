/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "repeat",
    category: "Music",
    description: "Repeats the current queue of songs.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: ["loop"],
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

        connection.mode = connection.mode === 0 ? 1 : 0;
        if (connection.mode === 1) {
            command_data.message.channel.send("Repeating current queue.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            command_data.message.channel.send("Stopped repeating current queue.").catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
