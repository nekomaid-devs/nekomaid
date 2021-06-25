module.exports = {
    name: "bal",
    category: "Profile",
    description: "Displays the tagged user's balance-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["balance", "bank"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let credits = command_data.tagged_user_config.credits;
        let bank = command_data.tagged_user_config.bank;

        let bankUpgrade = 0;
        command_data.tagged_user_config.inventory.forEach(item => {
            command_data.global_context.bot_config.items.forEach(item_2 => {
                if(item_2.id === item && item_2.type === "bankLimit") {
                    bankUpgrade += item_2.limit;
                }
            });
        });

        let embedBalance = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Balance`,
                icon_url: url
            },
            fields: [ 
                {
                    name: '💵    Credits:',
                    value: `$ ${credits}`,
                    inline: true
                },
                {
                    name: '🏦    Bank:',
                    value: `$ ${bank}/${(command_data.global_context.bot_config.bankLimit + bankUpgrade)}`,
                    inline: true
                }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag} | Cool stuff on the support server releasing soon!`
            },
        }

        command_data.msg.channel.send("", { embed: embedBalance }).catch(e => { console.log(e); });
    },
};