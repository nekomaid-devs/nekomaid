const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "shop",
    category: "Profile",
    description: "Displays all buyable items.",
    helpUsage: "[page?]` *(optional argument)*",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a page number.", "int>0")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        // TODO: add pagination
        let embedShop = new command_data.global_context.modules.Discord.MessageEmbed().setColor(8388736).setTitle("NekoMaid - Shop").setFooter(`Requested by ${command_data.msg.author.tag}`);

        /*let items = command_data.global_context.bot_config.shopItems;
        items.forEach(function (item) {
            command_data.global_context.bot_config.items.forEach(item2 => {
                if(item.id === item2.id) {
                    embedShop.addField(`#${item.id} - ${item2.display_name}`, `${command_data.global_context.utils.format_number(item.price)} credits`);
                }
            })
        });*/
        embedShop.setDescription("None");

        command_data.msg.channel.send({ embeds: [embedShop] }).catch((e) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
