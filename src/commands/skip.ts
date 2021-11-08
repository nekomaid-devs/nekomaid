/* Types */
import { CommandData, Command } from "../ts/base";
import { AudioPlayerStatus } from "@discordjs/voice";

export default {
    name: "skip",
    category: "Music",
    description: "Skips a song from the queue.",
    helpUsage: "`",
    exampleUsage: "",
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
        const connection = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        if (connection === undefined || connection.current === null) {
            command_data.msg.reply("There's nothing playing!");
            return;
        }

        const title = connection.current.item.title;
        connection.player.stop();
        connection.current = null;

        command_data.msg.channel.send(`Skipped \`${title}\`. (\`${connection.queue.length}\` remaining)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        if (connection.mode === 0) {
            connection.persistent_queue.shift();
        }
    },
} as Command;
