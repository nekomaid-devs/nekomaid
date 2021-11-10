/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { convert_string_to_time_data, convert_time, convert_time_data_to_string, convert_time_inconsistent, sub_times } from "../scripts/utils/util_time";

export default {
    name: "np",
    category: "Music",
    description: "Displays the current playing song.",
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
        // TODO: add buttons to skip song, etc.
        const connection = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.message.guild.id);
        if (connection === undefined || connection.current === null) {
            command_data.message.reply("There's nothing on the queue.");
            return;
        }

        const currentLength = convert_time(connection.current.item.duration);
        const descriptionText = `[${connection.current.item.title}](${connection.current.item.url}) *(${currentLength})*\n`;

        let totalLength = convert_string_to_time_data(convert_time(connection.current.item.duration));
        const elapsedLength = convert_string_to_time_data(convert_time(connection.elapsed_ms));
        totalLength = sub_times(totalLength, elapsedLength);
        totalLength = convert_time_inconsistent(totalLength);

        const embedNP = {
            color: 8388736,
            title: `Current playing for \`${command_data.message.guild.name}\``,
            footer: { text: "Nekomaid" },
            fields: [
                { name: "Title", value: descriptionText },
                { name: "Requested by", value: `<@${connection.current.user_ID}>` },
                { name: "Remaining", value: `\`${convert_time_data_to_string(totalLength)}\`` },
            ],
        };
        command_data.message.channel.send({ embeds: [embedNP] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
