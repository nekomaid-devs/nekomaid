/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "divorce",
    category: "Profile",
    description: "Divorces married user.",
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
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot_config === null) {
            return;
        }
        if (command_data.author_user_config.married_ID === null) {
            command_data.msg.reply("You're not married...");
            return;
        }

        // TODO: this part needs to be re-done
        const married_user = await command_data.global_context.bot.users.fetch(command_data.author_user_config.married_ID).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (married_user === null) {
            return;
        }
        const user_config = await command_data.global_context.neko_modules_clients.db.fetch_global_user(married_user.id, false, false);
        if (user_config === null) {
            return;
        }
        if (command_data.author_user_config.can_divorce === false) {
            command_data.msg.reply(`You can't divorce \`${married_user.tag}\`, because you're going be with them forever!`);
            return;
        }

        command_data.author_user_config.married_ID = null;
        command_data.global_context.neko_modules_clients.db.edit_global_user(command_data.author_user_config);

        user_config.married_ID = null;
        user_config.can_divorce = true;
        command_data.global_context.neko_modules_clients.db.edit_global_user(user_config);

        command_data.msg.channel.send(`\`${command_data.msg.author.tag}\` divorced \`${married_user.tag}\`!`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    }
} as Command;
