const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "upgrade",
    category: "Profile",
    description: "Upgrades a certain building.",
    helpUsage: "[building_name]`",
    exampleUsage: "Bank",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a building name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        
    },
};