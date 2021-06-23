const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'roleinfo',
    category: 'Utility',
    description: "Displays information about a role-",
    helpUsage: "[role name/mention]`",
    exampleUsage: "Owner",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a role name-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        let role = -1;
        if(data.msg.mentions.roles.size > 0) {
            role = Array.from(data.msg.mentions.roles.values())[0];
        } else {
            const roleName = data.args.join(" ");
            role = data.guild.roles.cache.find(roleTemp =>
                roleTemp.name === roleName || roleTemp.id === roleName
            );
            if(role === undefined) {
                data.reply("No role with name `" + roleName + "` found-");
                return;
            }
        }
        
        var end = new Date();
        var start = new Date(role.createdAt.toUTCString());
        var elapsed = end - start;
        var createdAgo = data.bot.tc.convertTime(elapsed);

        var permissions = ""
        var permissionsArray = role.permissions.toArray();
        permissionsArray.forEach((permission, index) => {
            permissions += "`" + permission + "`"

            if(permissionsArray.length - 1 > index) {
                permissions += ", ";
            }
        });

        //Construct embed
        var embedRole = {
            color: 8388736,
            author: {
                name: "Information about role " + role.name
            },
            fields: [ 
                    {
                        name: '❯ Role ID',
                        value: `${role.id}`,
                        inline: true
                    },
                    {
                        name: '❯ Position',
                        value: `${role.position}`,
                        inline: true
                    },
                    {
                        name: '❯ Members',
                        value: `${role.members.size}`,
                        inline: true
                    },
                    {
                        name: '❯ Permissions',
                        value: `${permissions}`
                    },
                    {
                        name: '❯ Mentionable',
                        value: `${role.mentionable}`,
                        inline: true
                    },
                    {
                        name: '❯ Showing in tab',
                        value: `${role.hoist}`,
                        inline: true
                    },
                    {
                        name: '❯ Color',
                        value: `${role.hexColor} (` + role + `)`,
                        inline: true
                    },
                    {
                        name: '❯ Created',
                        value: `${createdAgo} (${role.createdAt.toUTCString()})`
                    }
            ],
            footer: {
                    text: `Requested by ${data.authorTag}`
            },
        }

        //Send message
        data.channel.send("", { embed: embedRole }).catch(e => { console.log(e); });
    },
};