module.exports = {
    name: "shop",
    category: "Profile",
    description: "Displays all buyable items-",
    helpUsage: "[page?]` *(optional argument)*",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let embedShop = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle("NekoMaid - Shop")
        .setFooter(`Requested by ${command_data.msg.author.tag}`);

        let items = command_data.global_context.bot_config.shopItems;
        items.forEach(function (item) {
            command_data.global_context.bot_config.items.forEach(item2 => {
                if(item.id === item2.id) {
                    embedShop.addField(`#${item.id} - ${item2.displayName}`, `${item.price} credits`);
                }
            })
        });

        command_data.msg.channel.send("", { embed: embedShop }).catch(e => { console.log(e); });
    },
};