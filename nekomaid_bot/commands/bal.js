module.exports = {
    name: 'bal',
    category: 'Profile',
    description: "Displays the tagged user's balance-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["balance", "bank"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Construct embed
        var avatarUrl = data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 });
        var credits = data.taggedUserConfig.credits;
        var bank = data.taggedUserConfig.bank;

        var bankUpgrade = 0;
        data.taggedUserConfig.inventory.forEach(item => {
            data.botConfig.items.forEach(item2 => {
                if(item2.id === item && item2.type === "bankLimit") {
                    bankUpgrade += item2.limit;
                }
            });
        });

        var embedBalance = {
            color: 8388736,
            author: {
                name: `${data.taggedUserTag}'s Balance`,
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
        data.channel.send("", { embed: embedBalance }).catch(e => { console.log(e); });
    },
};