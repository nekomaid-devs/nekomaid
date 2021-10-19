module.exports = {
    name: "buildingsguide",
    category: "Profile",
    description: "Displays general information about all buildings.",
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
    async execute(command_data) {
        command_data.msg.channel.send({ embeds: [command_data.global_context.neko_modules.vars.get_buildings_guide_embed(command_data)] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
