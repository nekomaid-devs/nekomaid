/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { ms_to_string_yt } from "../scripts/utils/time";

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

        let title_text = "";
        let description_text = "";
        const fields: any[] = [];
        switch (connection.mode) {
            case 0: {
                title_text = `Queue for \`${command_data.message.guild.name}\` (${connection.queue.length} songs)`;

                for (let i = 1; i <= 5; i += 1) {
                    if (connection.queue.length >= i) {
                        const voice_request = connection.queue[i - 1];
                        description_text += `${i}) [${voice_request.item.title}](${voice_request.item.url}) *(${ms_to_string_yt(voice_request.item.duration)})* by *[<@${voice_request.user_ID}>]*\n`;
                    }
                }

                const additional_length = connection.queue.length - 5;
                if (additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                let total_length = connection.current.item.duration - connection.elapsed_ms;
                connection.queue.forEach((voice_request: any) => {
                    total_length += voice_request.info.duration;
                });

                fields.push({ name: "Currenly playing", value: `[${connection.current.item.title}](${connection.current.item.url}) *(${ms_to_string_yt(connection.current.item.duration)})*`, inline: false });
                fields.push({ name: "Total queue time", value: `\`${ms_to_string_yt(total_length)}\``, inline: true });
                break;
            }

            case 1: {
                title_text = `Queue for \`${command_data.message.guild.name}\` (repeating ${connection.persistent_queue.length} songs)`;

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
                        description_text += i2 === current_persistent_index ? `**${i2 + 1})** ` : `${i2 + 1}) `;
                        description_text += `[${voice_request.item.title}](${voice_request.item.url}) *(${ms_to_string_yt(voice_request.item.duration)})* - by [<@${voice_request.user_ID}>]\n`;
                    }
                }

                const additional_length = current_persistent_index > 0 ? connection.persistent_queue.length - current_persistent_index - 4 : connection.persistent_queue.length - current_persistent_index - 5;
                if (additional_length > 0) {
                    description_text += `** and \`${additional_length}\` more...**`;
                }

                let total_length = connection.current.item.duration - connection.elapsed_ms;
                connection.queue.forEach((voice_request: any) => {
                    total_length += voice_request.info.duration;
                });

                fields.push({
                    name: "Currenly playing",
                    value: `[${connection.persistent_queue[current_persistent_index].item.title}](${connection.persistent_queue[current_persistent_index].item.url}) *(${ms_to_string_yt(connection.current.item.duration)})*`,
                    inline: false,
                });
                fields.push({ name: "Total queue time", value: `\`${ms_to_string_yt(total_length)}\``, inline: true });
                break;
            }
        }

        const embedQueue = {
            color: 8388736,
            title: title_text,
            description: description_text,
            fields: fields,
            footer: { text: "Nekomaid" },
        };
        command_data.message.channel.send({ embeds: [embedQueue] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
