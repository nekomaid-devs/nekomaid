/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { ms_to_string_yt } from "../scripts/utils/time";

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

        const description_text = `[${connection.current.item.title}](${connection.current.item.url}) *(${ms_to_string_yt(connection.current.item.duration)})*\n`;
        const total_length = connection.current.item.duration - connection.elapsed_ms;
        const embedNP = {
            color: 8388736,
            title: `Current playing for \`${command_data.message.guild.name}\``,
            footer: { text: "Nekomaid" },
            fields: [
                { name: "Title", value: description_text },
                { name: "Requested by", value: `<@${connection.current.user_ID}>` },
                { name: "Remaining", value: `\`${ms_to_string_yt(total_length)}\`` },
            ],
        };
        command_data.message.channel.send({ embeds: [embedNP] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
