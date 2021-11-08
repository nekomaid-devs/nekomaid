/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { format_number, get_level_XP } from "../scripts/utils/util_general";

export default {
    name: "profile",
    category: "Profile",
    description: "Displays the tagged user's profile.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null || command_data.bot_data === null) {
            return;
        }
        let married_text = command_data.tagged_user_data.married_ID;
        if (married_text === null) {
            married_text = "Nobody";
        } else {
            const married_user = await command_data.global_context.bot.users.fetch(married_text).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
                return null;
            });
            if (married_user !== null) {
                married_text = `${married_user.username}#${married_user.discriminator}`;
                if (command_data.tagged_user_data.can_divorce === false) {
                    married_text += " (🔒)";
                }
            }
        }

        const end = new Date();
        const start = new Date(command_data.user_data.last_upvoted_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.bot_data.speed));
        const premium_text = diff < 1440 ? " (Premium ⭐)" : "";

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedProfile = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile ${premium_text}`,
                icon_url: url === null ? undefined : url,
            },
            fields: [
                {
                    name: "💵    Credits:",
                    value: `$ ${format_number(command_data.tagged_user_data.credits)}`,
                    inline: true,
                },
                {
                    name: "🏦    Bank:",
                    value: `$ ${format_number(command_data.tagged_user_data.bank)}/${format_number(command_data.tagged_user_data.bank_limit)}`,
                    inline: true,
                },
                {
                    name: "⚡    Level:",
                    value: `${command_data.tagged_user_data.level} (XP: ${Math.round(command_data.tagged_user_data.xp)}/${Math.round(get_level_XP(command_data.bot_data))})`,
                    inline: true,
                },
                {
                    name: "🎖️    Reputation:",
                    value: `${command_data.tagged_user_data.rep}`,
                    inline: true,
                },
                {
                    name: "❤️    Married with:",
                    value: `${married_text}`,
                },
            ],
            thumbnail: {
                url: url === null ? undefined : url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag} | Check out new ${command_data.guild_data.prefix}economyguide`,
            },
        };
        command_data.message.channel.send({ embeds: [embedProfile] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
