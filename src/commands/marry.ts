/* Types */
import { CommandData } from "../ts/types";

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
        if (command_data.msg.guild === null || command_data.tagged_user === undefined || command_data.global_context.bot_config === null) {
            return;
        }
        if (command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply("You can't marry yourself silly~");
            return;
        }

        let force_marry = false;
        if (command_data.args.length > 1 && command_data.args[1] === "-fm") {
            if (command_data.global_context.bot_config.bot_owners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply("You aren't the bot owner!");
                return;
            }

            force_marry = true;
        }

        if (command_data.author_user_config.married_ID !== "-1") {
            command_data.msg.reply("You need to divorce first!");
            return;
        }
        if (command_data.tagged_user_config.married_ID !== "-1") {
            command_data.msg.reply("This user is already married...");
            return;
        }

        if (force_marry === true) {
            const marriage_proposal = command_data.global_context.neko_modules_clients.marriageManager.add_marriage_proposal(command_data.global_context, command_data.msg.channel, command_data.msg.author, command_data.tagged_user, 0);
            command_data.global_context.neko_modules_clients.marriageManager.accept_marriage_proposal(command_data.global_context, command_data.msg.channel, marriage_proposal, 2);
        } else {
            command_data.global_context.neko_modules_clients.marriageManager.add_marriage_proposal(command_data.global_context, command_data.msg.channel, command_data.msg.author, command_data.tagged_user);
        }
    },
};
