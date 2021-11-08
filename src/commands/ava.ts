/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";

export default {
    name: "ava",
    category: "Utility",
    description: "Displays avatar of the tagged person.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["avatar"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedAvatar = {
            title: `Avatar Image of ${command_data.tagged_user.tag}`,
            color: 8388736,
            fields: [
                {
                    name: "Avatar Link:",
                    value: `[Click Here](${url})`,
                },
            ],
            image: {
                url: url === null ? undefined : url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };

        command_data.message.channel.send({ embeds: [embedAvatar] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
