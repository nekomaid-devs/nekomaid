module.exports = {
    name: 'shop',
    category: 'Profile',
    description: "Displays all buyable items-",
    helpUsage: "[page?]` *(optional argument)*",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Construst embed
        const embedShop = new data.bot.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle('NekoMaid - Shop')
        .setFooter(`Requested by ${data.authorTag}`);

        var items = data.botConfig.shopItems;

        items.forEach(function (item) {
            data.botConfig.items.forEach(item2 => {
                if(item.id === item2.id) {
                    embedShop.addField("#" + item.id + " - " + item2.displayName, item.price + " credits");
                }
            })
        })

        //Send message
        data.channel.send("", { embed: embedShop }).catch(e => { console.log(e); });
    },
};