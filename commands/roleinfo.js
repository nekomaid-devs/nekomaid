const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "roleinfo",
    category: "Utility",
    description: "Displays information about a role.",
    helpUsage: "[role name/mention]`",
    exampleUsage: "Owner",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a role name.", "none")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let role = -1;
        if(command_data.msg.mentions.roles.size > 0) {
            role = Array.from(command_data.msg.mentions.roles.values())[0];
        } else {
            role = command_data.msg.guild.roles.cache.find(roleTemp =>
                roleTemp.name === command_data.total_argument || roleTemp.id === command_data.total_argument
            );
            if(role === undefined) {
                command_data.msg.reply(`No role with name \`${command_data.total_argument}\` found!`);
                return;
            }
        }

        let elapsed = new Date() - new Date(role.createdAt.toUTCString());
        let createdAgo = command_data.global_context.neko_modules_clients.tc.convert_time(elapsed);
        let permissions = role.permissions.toArray().reduce((acc, curr) => { acc += "`" + curr + "`, "; return acc; }, "");
        permissions = permissions.slice(0, permissions.length - 2);
        if(permissions === "") {
            permissions = "`None`";
        }

        let embedRole = {
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
                    value: `${role.hexColor}`,
                    inline: true
                },
                {
                    name: '❯ Created',
                    value: `${createdAgo} (${role.createdAt.toUTCString()})`
                }
            ],
            footer: {
                    text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        command_data.msg.channel.send("", { embed: embedRole }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};