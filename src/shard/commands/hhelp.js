module.exports = {
    name: "hhelp",
    category: "Utility",
    description: ".",
    helpUsage: "`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        command_data.msg.channel.send("Help yourself...").catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
