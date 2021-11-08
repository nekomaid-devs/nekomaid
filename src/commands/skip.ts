/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "skip",
    category: "Music",
    description: "Skips a song from the queue.",
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

        const title = connection.current.item.title;
        connection.player.stop();
        connection.current = null;

        command_data.message.channel.send(`Skipped \`${title}\`. (\`${connection.queue.length}\` remaining)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        if (connection.mode === 0) {
            connection.persistent_queue.shift();
        }
    },
} as Command;
