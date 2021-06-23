module.exports = {
    name: 'profile',
    category: 'Profile',
    description: "Displays the tagged user's profile-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        var marriedText = data.taggedUserConfig.marriedID;

        if(marriedText === "-1") {
            marriedText = "Nobody";
        } else {
            var marriedUser = await data.bot.users.fetch(marriedText).catch(e => { console.log(e); });

            if(marriedUser !== undefined && marriedUser !== null) {
                marriedText = marriedUser.username + "#" + marriedUser.discriminator;

                if(data.taggedUserConfig.canDivorce == false) {
                    marriedText += " (🔒)"
                }
            }
        }

        //Construct embed
        var avatarUrl = data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 });

        var credits = data.taggedUserConfig.credits;
        var bank = data.taggedUserConfig.bank;
        var level = data.taggedUserConfig.level;
        var xp = data.taggedUserConfig.xp;
        var neededXP = data.botConfig.levelXP;
        var rep = data.taggedUserConfig.rep;

        var inventory = data.taggedUserConfig.inventory;
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
                if(data.botConfig.items.has(id) === true) {
                    var item2 = data.botConfig.items.get(id);
                    inventoryText += "`" + count + "x " + item2.displayName + "`";
                }
            });
        }

        //Get premium state
        var end = new Date();
        var start = new Date(data.authorConfig.lastUpvotedTime);

        var diff = (end.getTime() - start.getTime()) / 1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff));

        var premiumText = diff < 3600 ? " (Premium ⭐)" : "";

        var bankUpgrade = 0;
        data.taggedUserConfig.inventory.forEach(item => {
            data.botConfig.items.forEach(item2 => {
                if(item2.id === item && item2.type === "bankLimit") {
                    bankUpgrade += item2.limit;
                }
            });
        });

        var embedProfile = {
            color: 8388736,
            author: {
                name: `${data.taggedUserTag}'s Profile` + premiumText,
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
                        value: `$ ${bank}/${data.botConfig.bankLimit + bankUpgrade}`,
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
                text: `Requested by ${data.authorTag} | Cool stuff on the support server releasing soon!`
            },
        }

        //Send message
        data.channel.send("", { embed: embedProfile }).catch(e => { console.log(e); });
    },
};