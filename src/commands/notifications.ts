import { CommandData } from "../ts/types";

export default {
    name: "notifications",
    category: "Profile",
    description: "Displays own notifications related to economy.",
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
        if (command_data.msg.guild === null) {
            return;
        }
        let notifications_description = command_data.author_user_config.notifications
            .sort((a: any, b: any) => {
                return b.timestamp - a.timestamp;
            })
            .slice(0, 10)
            .reduce((acc: any, curr: any) => {
                const time_ago = Date.now() - curr.timestamp;
                acc += curr.description.replace("<time_ago>", "**[" + command_data.global_context.neko_modules.timeConvert.convert_time(time_ago) + "]** - ") + "\n";

                return acc;
            }, "");
        notifications_description = notifications_description.slice(0, notifications_description.length - 2);
        if (notifications_description === "") {
            notifications_description = "Empty";
        }

        const url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedNotifications: any = {
            author: {
                name: "Notifications",
                icon_url: url,
            },
            description: notifications_description,
            color: 8388736,
        };

        command_data.msg.channel.send({ embeds: [embedNotifications] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
