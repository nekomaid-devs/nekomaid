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
        let elapsed = new Date() - new Date(command_data.msg.guild.createdAt.toUTCString());
        let createdAgo = command_data.global_context.neko_modules_clients.tc.convertTime(elapsed);

        // TODO: fix owner tag
        let url = command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 });
        let embedServer = {
            color: 8388736,
            author: {
                name: `Information about server ${command_data.msg.guild.name}`,
                icon_url: url
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
                        value: `${command_data.msg.guild.owner.user.tag}`,
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
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        command_data.msg.channel.send("", { embed: embedServer }).catch(e => { console.log(e); });
    },
};