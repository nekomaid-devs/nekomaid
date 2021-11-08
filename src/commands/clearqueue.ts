/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "clearqueue",
    category: "Music",
    description: "Clears the current queue.",
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
        // TODO: this should skip the current song
        const connection = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.message.guild.id);
        if (connection === undefined) {
            command_data.message.reply("I'm not in a voice channel.");
            return;
        }

        connection.queue = [];
        connection.persistent_queue = [];

        command_data.message.channel.send("Cleared the current queue.").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
