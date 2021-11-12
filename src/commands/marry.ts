/* Types */
import { CommandData, Command } from "../ts/base";
import { TextChannel } from "discord.js-light";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "marry",
    category: "Profile",
    description: "Marries the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to mention somebody.", "mention", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || !(command_data.message.channel instanceof TextChannel)) {
            return;
        }
        if (command_data.message.author.id === command_data.tagged_user.id) {
            command_data.message.reply("You can't marry yourself silly~");
            return;
        }
        if (command_data.user_data.married_ID !== null) {
            command_data.message.reply("You need to divorce first!");
            return;
        }
        if (command_data.tagged_user_data.married_ID !== null) {
            command_data.message.reply("This user is already married...");
            return;
        }

        command_data.global_context.neko_modules_clients.marriageManager.add_marriage_proposal(command_data.global_context, command_data.message.author, command_data.tagged_user, command_data.message.channel);
    },
} as Command;
