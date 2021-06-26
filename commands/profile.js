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
        // TODO: re-factor command
        var marriedText = command_data.tagged_user_config.marriedID;

        if(marriedText === "-1") {
            marriedText = "Nobody";
        } else {
            var marriedUser = await data.bot.users.fetch(marriedText).catch(e => { console.log(e); });

            if(marriedUser !== undefined && marriedUser !== null) {
                marriedText = marriedUser.username + "#" + marriedUser.discriminator;

                if(command_data.tagged_user_config.canDivorce == false) {
                    marriedText += " (🔒)"
                }
            }
        }

        //Construct embed
        var avatarUrl = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });

        var credits = command_data.tagged_user_config.credits;
        var bank = command_data.tagged_user_config.bank;
        var level = command_data.tagged_user_config.level;
        var xp = command_data.tagged_user_config.xp;
        var neededXP = command_data.global_context.bot_config.levelXP;
        var rep = command_data.tagged_user_config.rep;

        var inventory = command_data.tagged_user_config.inventory;
        var inventoryText = ""

        if(inventory.length < 1) {
            inventoryText = "Empty";
        } else {
            var inventoryMap = new Map();
            inventory.forEach(id => {
                inventoryMap.set(id, inventoryMap.has(id) === true ? inventoryMap.get(id) + 1 : 1);
            });

            Array.from(inventoryMap.keys()).forEach(id => {
                let count = inventoryMap.get(id);

                if(inventoryText != "") { inventoryText += ", " }
                if(command_data.global_context.bot_config.items.has(id) === true) {
                    var item2 = command_data.global_context.bot_config.items.get(id);
                    inventoryText += "`" + count + "x " + item2.displayName + "`";
                }
            });
        }

        //Get premium state
        var end = new Date();
        var start = new Date(command_data.author_config.lastUpvotedTime);

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        var premiumText = diff < 3600 ? " (Premium ⭐)" : "";

        var bankUpgrade = 0;
        command_data.tagged_user_config.inventory.forEach(item => {
            command_data.global_context.bot_config.items.forEach(item2 => {
                if(item2.id === item && item2.type === "bankLimit") {
                    bankUpgrade += item2.limit;
                }
            });
        });

        let embedProfile = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile` + premiumText,
                icon_url: avatarUrl
            },
            fields: [ 
                    {
                        name: '💵    Credits:',
                        value: `$ ${credits}`,
                        inline: true
                    },
                    {
                        name: '🏦    Bank:',
                        value: `$ ${bank}/${command_data.global_context.bot_config.bankLimit + bankUpgrade}`,
                        inline: true
                    },
                    {
                        name: '⚡    Level:',
                        value: `${level} (XP: ${xp}/${neededXP})`
                    },
                    {
                        name: '🎖️    Reputation:',
                        value: `${rep}`
                    },
                    {
                        name: '❤️    Married with:',
                        value: `${marriedText}`
                    },
                    {
                        name: '📁    Inventory:',
                        value: `${inventoryText.length < 1024 ? inventoryText : inventoryText.substring(0, 1021) + "..."}`
                    }
            ],
            thumbnail: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag} | Cool stuff on the support server releasing soon!`
            },
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedProfile }).catch(e => { console.log(e); });
    },
};