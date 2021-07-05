const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_give",
    category: "Testing",
    description: "Adds an item to tagged user.",
    helpUsage: "[mention] [ammount] [itemID]`",
    exampleUsage: "/user_tag/ 1 0",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type mention somebody.", "mention"),
        new NeededArgument(2, "You need to type in an ammount.", "int>0"),
        new NeededArgument(3, "You need to type in an item ID.", "int")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        let ammount = parseInt(command_data.args[1]);
        let item_ID = command_data.args[2];

        let target_item = command_data.global_context.bot_config.items.has(item_ID) === true ? command_data.global_context.bot_config.items.get(item_ID) : -1;
        if(target_item === -1) {
            command_data.msg.reply(`There isn't any item with id \`${item_ID}\`-`);
            return;
        }

        for(var i = 0; i < ammount; i += 1) {
            command_data.tagged_user_config.inventory.push(item_ID);
        }
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: command_data.tagged_user_config });

        command_data.msg.channel.send(`Added \`${ammount}x ${target_item.displayName}\` to \`${command_data.tagged_user.tag}\`-`).catch(e => { console.log(e); });
    },
};