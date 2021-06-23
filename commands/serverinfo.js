module.exports = {
    name: 'serverinfo',
    category: 'Utility',
    description: "Displays information about the server-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var end = new Date();
        var start = new Date(data.msg.guild.createdAt.toUTCString());
        var elapsed = end - start;
        var createdAgo = data.bot.tc.convertTime(elapsed);

        //Construct embed
        var avatarUrl = data.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

        var embedServer = {
            color: 8388736,
            author: {
                name: "Information about server " + data.guild.name,
                icon_url: avatarUrl
            },
            fields: [ 
                    {
                        name: '❯ Server ID',
                        value: `${data.guild.id}`,
                        inline: true
                    },
                    {
                        name: '❯ Region',
                        value: `${data.guild.region}`,
                        inline: true
                    },
                    {
                        name: '❯ Owner',
                        value: `${data.guild.owner.user.username}#${data.guild.owner.user.discriminator}`,
                        inline: true
                    },
                    {
                        name: '❯ Members',
                        value: `${data.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: '❯ Channels',
                        value: `${data.guild.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: '❯ Roles',
                        value: `${data.guild.roles.cache.size}`,
                        inline: true
                    },
                    {
                        name: '❯ Created',
                        value: `${createdAgo} (${data.guild.createdAt.toUTCString()})`,
                        inline: true
                    }
            ],
            thumbnail: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${data.authorTag}`
            },
        }

        //Send message
        data.channel.send("", { embed: embedServer }).catch(e => { console.log(e); });
    },
};