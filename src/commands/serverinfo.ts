/* Types */
import { CommandData, Command } from "../ts/base";

export default {
    name: "serverinfo",
    category: "Utility",
    description: "Displays information about the server.",
    helpUsage: "`",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const elapsed = new Date().getTime() - new Date(command_data.msg.guild.createdAt.toUTCString()).getTime();
        const createdAgo = command_data.global_context.neko_modules.timeConvert.convert_time(elapsed);

        const url = command_data.msg.guild.iconURL({ format: "png", dynamic: true, size: 1024 });
        if (url === null) {
            return;
        }
        const owner = await command_data.msg.guild.fetchOwner();
        const embedServer = {
            color: 8388736,
            author: {
                name: `Information about server ${command_data.msg.guild.name}`,
                icon_url: url,
            },
            fields: [
                {
                    name: "❯ Server ID",
                    value: `${command_data.msg.guild.id}`,
                    inline: true,
                },
                {
                    name: "❯ Region",
                    value: "xx",
                    inline: true,
                },
                {
                    name: "❯ Owner",
                    value: `${owner.user.tag}`,
                    inline: true,
                },
                {
                    name: "❯ Members",
                    value: `${command_data.msg.guild.memberCount}`,
                    inline: true,
                },
                {
                    name: "❯ Channels",
                    value: `${command_data.msg.guild.channels.cache.size}`,
                    inline: true,
                },
                {
                    name: "❯ Roles",
                    value: `${command_data.msg.guild.roles.cache.size}`,
                    inline: true,
                },
                {
                    name: "❯ Created",
                    value: `${createdAgo} (${command_data.msg.guild.createdAt.toUTCString()})`,
                    inline: true,
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };
        command_data.msg.channel.send({ embeds: [ embedServer ] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
