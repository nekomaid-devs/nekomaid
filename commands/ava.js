module.exports = {
    name: 'ava',
    category: 'Utility',
    description: 'Displays avatar of the tagged person-',
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["avatar"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Construct embed
        var avatarUrl = data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 });
        var embedAvatar = {
            title: `Avatar Image of ${data.taggedUserTag}`,
            color: 8388736,
            fields: [ {
                        name: 'Avatar Link:',
                        value: `[Click Here](${avatarUrl})`
                    }
            ],
            image: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${data.authorTag}`
            },
        }

        //Send message
        data.channel.send("", { embed: embedAvatar }).catch(e => { console.log(e); });
    },
};