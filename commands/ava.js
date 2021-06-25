module.exports = {
    name: "ava",
    category: "Utility",
    description: "Displays avatar of the tagged person-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["avatar"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedAvatar = {
            title: `Avatar Image of ${command_data.tagged_user.tag}`,
            color: 8388736,
            fields: [
                {
                    name: 'Avatar Link:',
                    value: `[Click Here](${url})`
                }
            ],
            image: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }

        command_data.msg.channel.send("", { embed: embedAvatar }).catch(e => { console.log(e); });
    },
};