const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "building",
    category: "Profile",
    description: "Displays detailed information about a building.",
    helpUsage: "[building_name]`",
    exampleUsage: "\"Neko's Bank\"",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a building name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let building_name = command_data.total_argument.substring(command_data.total_argument.indexOf('"') + 1, command_data.total_argument.lastIndexOf('"'));

        let building_field = command_data.global_context.neko_modules.vars.get_building_field(building_name);
        let global_building_field = command_data.global_context.neko_modules.vars.get_global_building_field(building_name);
        if(building_field === undefined && global_building_field === undefined) {
            command_data.msg.reply(`Haven't found any building with name \`${building_name}\`.`);
        }

        let building_description = command_data.global_context.neko_modules.vars.get_building_description(building_field !== undefined ? building_field : global_building_field);
        let embedBuilding = {
            color: 8388736,
            title: `Building - ${building_name}`,
            description: building_description,
            footer: { text: `Requested by ${command_data.msg.author.tag}` }
        }
        command_data.msg.channel.send("", { embed: embedBuilding }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};