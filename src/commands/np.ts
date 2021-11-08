/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { convert_string_to_time_data, convert_time, convert_time_data_to_string, convert_time_inconsistent, convert_youtube_string_to_time_data, sub_times } from "../scripts/utils/util_time";

export default {
    name: "np",
    category: "Music",
    description: "Displays the current playing song.",
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
        // TODO: add buttons to skip song, etc.
        const connection = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        if (connection === undefined || connection.current === null) {
            command_data.msg.reply("There's nothing on the queue.");
            return;
        }

        const embedNP = new command_data.global_context.modules.Discord.MessageEmbed();
        embedNP.setColor(8388736).setTitle(`Current playing for \`${command_data.msg.guild.name}\``).setFooter("Nekomaid");

        const currentLength = convert_time(connection.current.item.duration);
        const descriptionText = `[${connection.current.item.title}](${connection.current.item.url}) *(${currentLength})*\n`;

        let totalLength = convert_string_to_time_data(convert_time(connection.current.item.duration));
        const elapsedLength = convert_string_to_time_data(convert_time(connection.elapsed_ms));
        totalLength = sub_times(totalLength, elapsedLength);
        totalLength = convert_time_inconsistent(totalLength);

        embedNP.addField("Title", descriptionText);
        embedNP.addField("Requested by", `<@${connection.current.user_ID}>`);
        embedNP.addField("Remaining", `\`${convert_time_data_to_string(totalLength)}\``);
        command_data.msg.channel.send({ embeds: [embedNP] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
