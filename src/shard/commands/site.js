module.exports = {
    name: "site",
    category: "Help & Information",
    description: "Check out our website!",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let embedSite = {
            title: "",
            color: 8388736,
            fields: [
                {
                    name: "Check out our website!",
                    value: `[Website](https://nekomaid.xyz)`,
                },
            ],
        };

        command_data.msg.channel.send({ embeds: [embedSite] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
