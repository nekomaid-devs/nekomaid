const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "inventory",
    category: "Profile",
    description: "Displays the tagged user's inventory.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let inventory = command_data.tagged_user_config.inventory;
        let inventory_text = "";
        if(inventory.length < 1) {
            inventory_text = "Empty";
        } else {
            let inventory_map = new Map();
            inventory.forEach(id => {
                inventory_map.set(id, inventory_map.has(id) === true ? inventory_map.get(id) + 1 : 1);
            });

            Array.from(inventory_map.keys()).forEach(id => {
                let count = inventory_map.get(id);

                if(inventory_text != "") { inventory_text += ", " }
                if(command_data.global_context.bot_config.items.has(id) === true) {
                    let item = command_data.global_context.bot_config.items.get(id);
                    inventory_text += "`" + count + "x " + item.display_name + "`";
                }
            });
        }

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedInventory = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Inventory (${inventory.length} items)`,
                icon_url: url
            },
            description: (inventory_text.length < 3072 ? inventory_text : inventory_text.substring(0, 3069) + "..."),
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        command_data.msg.channel.send("", { embed: embedInventory }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};