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
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        if (command_data.user_data.married_ID === null) {
            command_data.message.reply("You're not married...");
            return;
        }

        // TODO: this part needs to be re-done
        const married_user = await command_data.global_context.bot.users.fetch(command_data.user_data.married_ID).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (married_user === null) {
            return;
        }
        const user_data = await command_data.global_context.neko_modules_clients.db.fetch_user(married_user.id, false, false);
        if (user_data === null) {
            return;
        }
        if (command_data.user_data.can_divorce === false) {
            command_data.message.reply(`You can't divorce \`${married_user.tag}\`, because you're going be with them forever!`);
            return;
        }

        command_data.user_data.married_ID = null;
        command_data.global_context.neko_modules_clients.db.edit_user(command_data.user_data);

        user_data.married_ID = null;
        user_data.can_divorce = true;
        command_data.global_context.neko_modules_clients.db.edit_user(user_data);

        command_data.message.channel.send(`\`${command_data.message.author.tag}\` divorced \`${married_user.tag}\`!`).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
