import { CommandData } from "../ts/types";

export default {
    name: "np",
    category: "Music",
    description: "Displays the current playing song.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        // TODO: add buttons to skip song, etc.
        if (
            command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.msg.guild.id) === false ||
            command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id).current === -1
        ) {
            command_data.msg.reply("There's nothing on the queue.");
            return;
        }

        const voice_data = command_data.global_context.neko_modules_clients.voiceManager.connections.get(command_data.msg.guild.id);
        const embedNP = new command_data.global_context.modules.Discord.MessageEmbed();
        embedNP.setColor(8388736).setTitle(`Current playing for \`${command_data.msg.guild.name}\``).setFooter("Nekomaid");

        const currentLength0b = command_data.global_context.neko_modules.timeConvert.convert_time_data_to_string(command_data.global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(voice_data.current.info.duration));
        const user = await command_data.global_context.bot.users.fetch(voice_data.current.request_user_ID).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
        if (user !== undefined) {
            const descriptionText = `[${voice_data.current.info.title}](${voice_data.current.info.url}) *(${currentLength0b})*\n`;

            let totalLength = command_data.global_context.neko_modules.timeConvert.convert_youtube_string_to_time_data(voice_data.current.info.duration);
            const elapsedLength = command_data.global_context.neko_modules.timeConvert.convert_string_to_time_data(command_data.global_context.neko_modules.timeConvert.convert_time(voice_data.elapsed_ms));
            totalLength = command_data.global_context.neko_modules.timeConvert.sub_times(totalLength, elapsedLength);
            totalLength = command_data.global_context.neko_modules.timeConvert.convert_time_inconsistent(totalLength);
            totalLength = command_data.global_context.neko_modules.timeConvert.convert_time_data_to_string(totalLength);

            embedNP.addField("Title", descriptionText);
            embedNP.addField("Requested by", `\`${user.tag}\``);
            embedNP.addField("Remaining", `\`${totalLength}\``);
            command_data.msg.channel.send({ embeds: [embedNP] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
