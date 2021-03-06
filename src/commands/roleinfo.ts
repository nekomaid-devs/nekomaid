/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { ms_to_string } from "../scripts/utils/time";

export default {
    name: "roleinfo",
    category: "Utility",
    description: "Displays information about a role.",
    helpUsage: "[role name/mention]`",
    exampleUsage: "Owner",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "You need to type in a role name.", "none", true)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        let role;
        if (command_data.message.mentions.roles.size > 0) {
            role = Array.from(command_data.message.mentions.roles.values())[0];
        } else {
            role = Array.from((await command_data.message.guild.roles.fetch()).values()).find((roleTemp) => {
                return roleTemp.name === command_data.total_argument || roleTemp.id === command_data.total_argument;
            });
            if (role === undefined) {
                command_data.message.reply(`No role with name \`${command_data.total_argument}\` found!`);
                return;
            }
        }

        const elapsed = Date.now() - new Date(role.createdAt.toUTCString()).getTime();
        const createdAgo = ms_to_string(elapsed);
        let permissions = role.permissions.toArray().reduce((acc, curr) => {
            acc += `\`${curr}\`, `;
            return acc;
        }, "");
        permissions = permissions.slice(0, permissions.length - 2);
        if (permissions === "") {
            permissions = "`None`";
        }

        const embedRole = {
            color: 8388736,
            author: {
                name: `Information about role ${role.name}`,
            },
            fields: [
                {
                    name: "❯ Role ID",
                    value: `${role.id}`,
                    inline: true,
                },
                {
                    name: "❯ Position",
                    value: `${role.position}`,
                    inline: true,
                },
                {
                    name: "❯ Members",
                    value: `${role.members.size}`,
                    inline: true,
                },
                {
                    name: "❯ Permissions",
                    value: `${permissions}`,
                },
                {
                    name: "❯ Mentionable",
                    value: `${role.mentionable}`,
                    inline: true,
                },
                {
                    name: "❯ Showing in tab",
                    value: `${role.hoist}`,
                    inline: true,
                },
                {
                    name: "❯ Color",
                    value: `${role.hexColor}`,
                    inline: true,
                },
                {
                    name: "❯ Created",
                    value: `${createdAgo} (${role.createdAt.toUTCString()})`,
                },
            ],
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedRole] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
