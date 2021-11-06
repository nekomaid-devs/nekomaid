/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "invite",
    category: "Help & Information",
    description: "Sends invite for the bot.",
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
        if (command_data.msg.guild === null || command_data.global_context.bot.user === null) {
            return;
        }
        const link = `https://discord.com/oauth2/authorize?client_id=${command_data.global_context.bot.user.id}&permissions=1547037910&scope=bot`;
        const embedInvite = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Invite NekoMaid to your server <:n_invite:771826253694631977>",
                    value: `[Click here](${link})`,
                },
            ],
        };

        command_data.msg.channel.send({ embeds: [ embedInvite ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
