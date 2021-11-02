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
        const voice_request = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id).current;
        voice_data.current.stream.destroy();
        voice_data.current = -1;

        command_data.msg.channel.send(`Skipped \`${voice_request.info.title}\`. (\`${command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id).queue.length}\` remaining)`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        if (voice_data.mode === 0) {
            voice_data.persistent_queue.shift();
        }

        command_data.global_context.neko_modules_clients.voiceManager.play_next_on_connection(command_data.global_context, command_data.msg.guild.id);
    },
} as Command;
