/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import { ms_to_string } from "../scripts/utils/time";

export default {
    name: "serverinfo",
    category: "Utility",
    description: "Displays information about the server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    arguments: [],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const elapsed = Date.now() - command_data.message.guild.createdAt.getTime();
        const createdAgo = ms_to_string(elapsed);

        const url = command_data.message.guild.iconURL({ format: "png", dynamic: true, size: 1024 });
        if (url === null) {
            return;
        }
        const owner = await command_data.message.guild.fetchOwner();
        const embedServer = {
            color: 8388736,
            author: {
                name: `Information about server ${command_data.message.guild.name}`,
                icon_url: url,
            },
            fields: [
                {
                    name: "❯ Server ID",
                    value: `${command_data.message.guild.id}`,
                    inline: true,
                },
                {
                    name: "❯ Owner",
                    value: `${owner.user.tag}`,
                    inline: true,
                },
                {
                    name: "❯ Members",
                    value: `${command_data.message.guild.memberCount}`,
                    inline: true,
                },
                {
                    name: "❯ Channels",
                    value: `${"??"}`,
                    inline: true,
                },
                {
                    name: "❯ Roles",
                    value: `${"??"}`,
                    inline: true,
                },
                {
                    name: "❯ Created",
                    value: `${createdAgo} (${command_data.message.guild.createdAt.toUTCString()})`,
                    inline: true,
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };
        command_data.message.channel.send({ embeds: [embedServer] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
