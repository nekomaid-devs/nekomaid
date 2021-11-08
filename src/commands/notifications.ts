/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { convert_time } from "../scripts/utils/util_time";

export default {
    name: "notifications",
    category: "Profile",
    description: "Displays own notifications related to economy.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let notifications_description = command_data.user_data.notifications
            .sort((a, b) => {
                return b.timestamp - a.timestamp;
            })
            .slice(0, 10)
            .reduce((acc, curr) => {
                const time_ago = Date.now() - curr.timestamp;
                acc += `${curr.description.replace("<time_ago>", `**[${convert_time(time_ago)}]** - `)}\n`;

                return acc;
            }, "");
        notifications_description = notifications_description.slice(0, notifications_description.length - 2);
        if (notifications_description === "") {
            notifications_description = "Empty";
        }

        const url = command_data.message.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedNotifications = {
            author: {
                name: "Notifications",
                icon_url: url === null ? undefined : url,
            },
            description: notifications_description,
            color: 8388736,
        };

        command_data.message.channel.send({ embeds: [embedNotifications] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
