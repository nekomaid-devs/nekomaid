const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "d_giveinserver",
    category: "Testing",
    description: "Adds an item to all users in a server.",
    helpUsage: "[ammount] [itemID]`",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an ammount.", "int>0"),
        new NeededArgument(2, "You need to type in an item ID.", "int")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    async execute(command_data) {
        let ammount = parseInt(command_data.args[0]);
        let item_ID = command_data.args[1];
        let target_item = Array.from(command_data.global_context.bot_config.items.values()).find(e => { return e.id === item_ID; });

        if(target_item === undefined) {
            command_data.msg.reply(`There isn't any item with id \`${item_ID}\`.`);
            return;
        }

        await command_data.global_context.utils.verify_guild_members(command_data.msg.guild);
        command_data.msg.guild.members.cache.forEach(async(member) => {
            let config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "global_user", id: member.user.id });
            for(var i = 0; i < ammount; i += 1) {
                config.inventory.push(item_ID);
            }
            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: member.user.id, user: config });
        });

        command_data.msg.channel.send(`Added \`${ammount}x ${target_item.display_name}\` to \`${command_data.msg.guild.members.cache.size}\` members!`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};