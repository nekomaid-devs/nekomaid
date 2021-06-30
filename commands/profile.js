module.exports = {
    name: "profile",
    category: "Profile",
    description: "Displays the tagged user's profile-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: add inventory command and remove inventory from here
        let married_text = command_data.tagged_user_config.marriedID;
        if(married_text === "-1") {
            married_text = "Nobody";
        } else {
            let married_user = await command_data.global_context.bot.users.fetch(married_text).catch(e => { console.log(e); });
            if(married_user !== undefined && married_user !== null) {
                married_text = married_user.username + "#" + married_user.discriminator;
                if(command_data.tagged_user_config.canDivorce == false) {
                    married_text += " (🔒)";
                }
            }
        }

        let inventory = command_data.tagged_user_config.inventory;
        let inventory_text = "";
        if(inventory.length < 1) {
            inventory_text = "Empty";
        } else {
            let inventoryMap = new Map();
            inventory.forEach(id => {
                inventoryMap.set(id, inventoryMap.has(id) === true ? inventoryMap.get(id) + 1 : 1);
            });

            Array.from(inventoryMap.keys()).forEach(id => {
                let count = inventoryMap.get(id);

                if(inventory_text != "") { inventory_text += ", " }
                if(command_data.global_context.bot_config.items.has(id) === true) {
                    let item = command_data.global_context.bot_config.items.get(id);
                    inventory_text += "`" + count + "x " + item.displayName + "`";
                }
            });
        }

        let end = new Date();
        let start = new Date(command_data.author_config.lastUpvotedTime);
        let diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));
        let premium_text = diff < 1440 ? " (Premium ⭐)" : "";

        let bank_upgrade = 0;
        command_data.tagged_user_config.inventory.forEach(item => {
            command_data.global_context.bot_config.items.forEach(item2 => {
                if(item2.id === item && item2.type === "bankLimit") {
                    bank_upgrade += item2.limit;
                }
            });
        });

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedProfile = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile ${premium_text}`,
                icon_url: url
            },
            fields: [ 
                    {
                        name: '💵    Credits:',
                        value: `$ ${command_data.tagged_user_config.credits}`,
                        inline: true
                    },
                    {
                        name: '🏦    Bank:',
                        value: `$ ${command_data.tagged_user_config.bank}/${(command_data.global_context.bot_config.bankLimit + bank_upgrade)}`,
                        inline: true
                    },
                    {
                        name: '⚡    Level:',
                        value: `${command_data.tagged_user_config.level} (XP: ${command_data.tagged_user_config.xp}/${command_data.global_context.bot_config.levelXP})`
                    },
                    {
                        name: '🎖️    Reputation:',
                        value: `${command_data.tagged_user_config.rep}`
                    },
                    {
                        name: '❤️    Married with:',
                        value: `${married_text}`
                    },
                    {
                        name: '📁    Inventory:',
                        value: `${inventory_text.length < 1024 ? inventory_text : inventory_text.substring(0, 1021) + "..."}`
                    }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag} | Cool stuff on the support server releasing soon!`
            },
        }
        command_data.msg.channel.send("", { embed: embedProfile }).catch(e => { console.log(e); });
    },
};