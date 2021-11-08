/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "leave",
    category: "Music",
    description: "Leaves the voice channel.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: ["stop"],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        // TODO: check for guild voice aswell
        if (command_data.global_context.neko_modules_clients.voiceManager.connections.has(command_data.message.guild.id) === false) {
            command_data.message.reply("I'm not in a voice channel.");
            return;
        }

        command_data.global_context.neko_modules_clients.voiceManager.remove_connection(command_data.global_context, command_data.message.guild.id, null);
        command_data.message.channel.send("Left the voice channel.").catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
