/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { format_number, get_user_bank_limit } from "../scripts/utils/util_general";

export default {
    name: "bal",
    category: "Profile",
    description: "Displays the tagged user's balance.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["balance", "bank"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        // TODO: add position in top

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedBalance = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Balance`,
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
                    value: `$ ${format_number(command_data.tagged_user_data.bank)}/${format_number(get_user_bank_limit(command_data.tagged_user_data))}`,
                    inline: true,
                },
            ],
            thumbnail: {
                url: url === null ? undefined : url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag} | Check out new ${command_data.guild_data.prefix}economyguide`,
            },
        };

        command_data.message.channel.send({ embeds: [embedBalance] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
