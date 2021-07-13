const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "item",
    category: "Profile",
    description: "Displays info about an item.",
    helpUsage: "[item_name]`",
    exampleUsage: "Rare Box",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an item name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: maybe add some more cool information
        let item_name = command_data.total_argument;

        let target_item = Array.from(command_data.global_context.bot_config.items.values()).find(e => { return e.display_name === item_name; });
        if(target_item === undefined) {
            command_data.msg.reply(`Haven't found any item with name \`${item_name}\`.`);
            return;
        }

        let embedItem = {
            color: 8388736,
            title: `Item - ${target_item.display_name}`,
            description: target_item.description,
            footer: { text: `Requested by ${command_data.msg.author.tag}` }
        }
        command_data.msg.channel.send("", { embed: embedItem }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};