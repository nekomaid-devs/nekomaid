module.exports = {
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
    execute(command_data) {
        let notifications_description = command_data.author_config.notifications
        .sort((a, b) => { return b.timestamp - a.timestamp; })
        .slice(0, 10)
        .reduce((acc, curr) => {
            let time_ago = Date.now() - curr.timestamp;
            acc += curr.description.replace("<time_ago>", "**[" + command_data.global_context.neko_modules_clients.tc.convert_time(time_ago) + "]** - ") + "\n";

            return acc;
        }, "");
        notifications_description = notifications_description.slice(0, notifications_description.length - 2);
        if(notifications_description === "") {
            notifications_description = "Empty";
        }

        let url = command_data.msg.author.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedNotifications = {
            author: {
                name: "Notifications",
                icon_url: url
            },
            description: notifications_description,
            color: 8388736
        }
        
        command_data.msg.channel.send("", { embed: embedNotifications }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};