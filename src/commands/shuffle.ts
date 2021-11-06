/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { shuffle_array } from "../scripts/utils/util_general";

export default {
    name: "shuffle",
    category: "Music",
    description: "Randomizes the current queue.",
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

        if (connection.mode === 0) {
            shuffle_array(connection.queue);
            connection.persistent_queue = [connection.current];
            connection.queue.forEach((voiceRequest: any) => {
                connection.persistent_queue.push(voiceRequest);
            });

            command_data.msg.channel.send(`Shuffled \`${connection.queue.length}\` songs.`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } else {
            shuffle_array(connection.persistent_queue);

            let currentPersistentIndex = connection.persistent_queue.length;
            let i = 0;
            connection.queue = [];
            connection.persistent_queue.forEach((voice_request) => {
                if (connection.current !== null && voice_request.id === connection.current.id) {
                    currentPersistentIndex = i;
                }
                if (currentPersistentIndex < i) {
                    connection.queue.push(voice_request);
                }

                i += 1;
            });

            command_data.msg.channel.send(`Shuffled \`${connection.persistent_queue.length}\` songs.`).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
