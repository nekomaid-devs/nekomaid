/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "upvote",
    category: "Help & Information",
    description: "Upvote the bot to get extra features for free!",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: ["vote"],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.global_context.bot.user === null) {
            return;
        }
        const url = `https://cdn.discordapp.com/app-icons/${command_data.global_context.bot.user.id}/cd4710d92ec10005b17d942c51c722d2.png`;

        const embedUpvote = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Upvote NekoMaid ˇˇ",
                    value: "[top.gg](https://top.gg/bot/691398095841263678)",
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: "Thank you for voting 💖",
            },
        };
        command_data.message.channel.send({ embeds: [embedUpvote] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
