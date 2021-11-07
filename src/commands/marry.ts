/* Types */
import { CommandData, Command } from "../ts/base";
import { TextChannel } from "discord.js-light";

/* Local Imports */
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "marry",
    category: "Profile",
    description: "Marries the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to mention somebody.", "mention")],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.msg.guild === null || !(command_data.msg.channel instanceof TextChannel) || command_data.tagged_user === undefined || command_data.global_context.bot_config === null) {
            return;
        }
        if (command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply("You can't marry yourself silly~");
            return;
        }
        if (command_data.author_user_config.married_ID !== null) {
            command_data.msg.reply("You need to divorce first!");
            return;
        }
        if (command_data.tagged_user_config.married_ID !== null) {
            command_data.msg.reply("This user is already married...");
            return;
        }

        command_data.global_context.neko_modules_clients.marriageManager.add_marriage_proposal(command_data.global_context, command_data.msg.author, command_data.tagged_user, command_data.msg.channel);
    },
} as Command;
