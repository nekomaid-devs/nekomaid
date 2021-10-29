import { CommandData } from "../ts/types";

import RecommendedArgument from "../scripts/helpers/recommended_argument";

export default {
    name: "profile",
    category: "Profile",
    description: "Displays the tagged user's profile.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a mention.", "mention")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        let married_text = command_data.tagged_user_config.married_ID;
        if (married_text === "-1") {
            married_text = "Nobody";
        } else {
            const married_user = await command_data.global_context.bot.users.fetch(married_text).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
            if (married_user !== undefined && married_user !== null) {
                married_text = married_user.username + "#" + married_user.discriminator;
                if (command_data.tagged_user_config.can_divorce == false) {
                    married_text += " (🔒)";
                }
            }
        }

        const end = new Date();
        const start = new Date(command_data.author_user_config.last_upvoted_time);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff * command_data.global_context.bot_config.speed));
        const premium_text = diff < 1440 ? " (Premium ⭐)" : "";

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        if(url === null) { return; }
        const embedProfile = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile ${premium_text}`,
                icon_url: url,
            },
            fields: [
                {
                    name: "💵    Credits:",
                    value: `$ ${command_data.global_context.utils.format_number(command_data.tagged_user_config.credits)}`,
                    inline: true,
                },
                {
                    name: "🏦    Bank:",
                    value: `$ ${command_data.global_context.utils.format_number(command_data.tagged_user_config.bank)}/${command_data.global_context.utils.format_number(command_data.tagged_user_config.bank_limit)}`,
                    inline: true,
                },
                {
                    name: "⚡    Level:",
                    value: `${command_data.tagged_user_config.level} (XP: ${Math.round(command_data.tagged_user_config.xp)}/${Math.round(
                        command_data.global_context.utils.get_level_XP(command_data.server_config, command_data.tagged_user_config)
                    )})`,
                    inline: true,
                },
                {
                    name: "🎖️    Reputation:",
                    value: `${command_data.tagged_user_config.rep}`,
                    inline: true,
                },
                {
                    name: "❤️    Married with:",
                    value: `${married_text}`,
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag} | Check out new ${command_data.server_config.prefix}economyguide`,
            },
        };
        command_data.msg.channel.send({ embeds: [embedProfile] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
