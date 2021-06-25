module.exports = {
    name: "serverinfo",
    category: "Utility",
    description: "Displays information about the server-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var end = new Date();
        var start = new Date(data.msg.guild.createdAt.toUTCString());
        var elapsed = end - start;
        var createdAgo = data.bot.tc.convertTime(elapsed);

        //Construct embed
        var avatarUrl = command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 });

        let embedServer = {
            color: 8388736,
            author: {
                name: "Information about server " + command_data.msg.guild.name,
                icon_url: avatarUrl
            },
            fields: [ 
                    {
                        name: '❯ Server ID',
                        value: `${command_data.msg.guild.id}`,
                        inline: true
                    },
                    {
                        name: '❯ Region',
                        value: `${command_data.msg.guild.region}`,
                        inline: true
                    },
                    {
                        name: '❯ Owner',
                        value: `${command_data.msg.guild.owner.user.username}#${command_data.msg.guild.owner.user.discriminator}`,
                        inline: true
                    },
                    {
                        name: '❯ Members',
                        value: `${command_data.msg.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: '❯ Channels',
                        value: `${command_data.msg.guild.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: '❯ Roles',
                        value: `${command_data.msg.guild.roles.cache.size}`,
                        inline: true
                    },
                    {
                        name: '❯ Created',
                        value: `${createdAgo} (${command_data.msg.guild.createdAt.toUTCString()})`,
                        inline: true
                    }
            ],
            thumbnail: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedServer }).catch(e => { console.log(e); });
    },
};