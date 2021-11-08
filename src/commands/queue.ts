/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { convert_string_to_time_data, convert_time, convert_time_data_to_string, convert_time_inconsistent, convert_youtube_string_to_time_data, sub_times, sum_times } from "../scripts/utils/util_time";

export default {
    name: "queue",
    category: "Music",
    description: "Displays the queue.",
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
            command_data.message.reply("There's nothing on the queue!");
            return;
        }

        const embedQueue = new command_data.global_context.modules.Discord.MessageEmbed();
        let description_text = "";

        switch (connection.mode) {
            case 0: {
                embedQueue.setColor(8388736).setTitle(`Queue for \`${command_data.message.guild.name}\` (${connection.queue.length} songs)`).setFooter("Nekomaid");

                for (let i = 1; i <= 5; i += 1) {
                    if (connection.queue.length >= i) {
                        const voice_request = connection.queue[i - 1];
                        const current_length = convert_string_to_time_data(convert_time(voice_request.item.duration));
                        description_text += `${i}) [${voice_request.item.title}](${voice_request.item.url}) *(${current_length})* by *[<@${voice_request.user_ID}>]*\n`;
                    }
                }

                const additional_length = connection.queue.length - 5;
                if (additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                embedQueue.setDescription(description_text);

                let total_length = convert_string_to_time_data(convert_time(connection.current.item.duration));
                const elapsedLength = convert_string_to_time_data(convert_time(connection.elapsed_ms));
                total_length = sub_times(total_length, elapsedLength);

                connection.queue.forEach((voice_request: any) => {
                    const current_length = convert_youtube_string_to_time_data(voice_request.info.duration);
                    total_length = sum_times(total_length, current_length);
                });
                total_length = convert_time_inconsistent(total_length);
                const total_length_2 = convert_time_data_to_string(total_length);

                const current_length = convert_string_to_time_data(convert_time(connection.current.item.duration));
                embedQueue.addField("Currenly playing", `[${connection.current.item.title}](${connection.current.item.url}) *(${current_length})*`, false);
                embedQueue.addField("Total queue time", `\`${total_length_2}\``, true);
                break;
            }

            case 1: {
                embedQueue.setColor(8388736).setTitle(`Queue for \`${command_data.message.guild.name}\` (repeating ${connection.persistent_queue.length} songs)`).setFooter("Nekomaid");

                let i0 = 0;
                let current_persistent_index = 0;
                let start = 0;
                const end = 4;
                connection.persistent_queue.forEach((voice_request) => {
                    if (connection.current !== null && voice_request.id === connection.current.id) {
                        current_persistent_index = i0;
                    }

                    i0 += 1;
                });

                if (connection.persistent_queue.length <= 5) {
                    start = 0;
                } else {
                    start = current_persistent_index > 0 ? current_persistent_index - 1 : current_persistent_index;
                }

                for (let i2 = start; i2 <= start + end; i2++) {
                    if (connection.persistent_queue.length > i2) {
                        const voice_request = connection.persistent_queue[i2];
                        const current_length = convert_string_to_time_data(convert_time(voice_request.item.duration));
                        description_text += i2 === current_persistent_index ? `**${i2 + 1})** ` : `${i2 + 1}) `;
                        description_text += `[${voice_request.item.title}](${voice_request.item.url}) *(${current_length})* - by [<@${voice_request.user_ID}>]\n`;
                    }
                }

                const additional_length = current_persistent_index > 0 ? connection.persistent_queue.length - current_persistent_index - 4 : connection.persistent_queue.length - current_persistent_index - 5;
                if (additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                embedQueue.setDescription(description_text);

                let total_length_2_b = convert_string_to_time_data(convert_time(connection.current.item.duration));

                const elapsedLength2b = convert_string_to_time_data(convert_time(connection.elapsed_ms));
                total_length_2_b = sub_times(total_length_2_b, elapsedLength2b);

                connection.persistent_queue.forEach((voice_request: any) => {
                    const current_length = convert_youtube_string_to_time_data(voice_request.info.duration);
                    total_length_2_b = sum_times(total_length_2_b, current_length);
                });
                total_length_2_b = convert_time_inconsistent(total_length_2_b);
                const total_length_2_c = convert_time_data_to_string(total_length_2_b);

                const current_length_b = convert_string_to_time_data(convert_time(connection.persistent_queue[current_persistent_index].item.duration));
                embedQueue.addField("Currenly playing", `[${connection.persistent_queue[current_persistent_index].item.title}](${connection.persistent_queue[current_persistent_index].item.url}) *(${current_length_b})*`, false);
                embedQueue.addField("Total queue time", `\`${total_length_2_c}\``, true);
                break;
            }
        }

        command_data.message.channel.send({ embeds: [embedQueue] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
