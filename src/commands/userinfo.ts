/* Types */
import { CommandData, Command } from "../ts/base";

/* Local Imports */
import Argument from "../scripts/helpers/argument";
import { ms_to_string } from "../scripts/utils/time";

export default {
    name: "userinfo",
    category: "Utility",
    description: "Displays information about the tagged user.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["memberinfo"],
    subcommandHelp: new Map(),
    arguments: [new Argument(1, "Argument needs to be a mention.", "mention", false)],
    permissions: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.message.guild === null) {
            return;
        }
        const presence = "Online <:n_online:725010541352976414>";
        const elapsedCreated = Date.now() - command_data.tagged_user.createdAt.getTime();
        const createdAgo = ms_to_string(elapsedCreated);

        const elapsedJoined = command_data.tagged_member.joinedAt === null ? 0 : Date.now() - command_data.tagged_member.joinedAt.getTime();
        const joinedAgo = ms_to_string(elapsedJoined);

        let roles = Array.from(command_data.tagged_member.roles.cache.values()).reduce((acc, curr) => {
            acc += `${curr.toString()}, `;
            return acc;
        }, "");
        roles = roles.slice(0, roles.length - 2);
        if (roles === "") {
            roles = "`None`";
        }

        const join_score_array = Array.from((await command_data.message.guild.members.fetch()).values()).sort((a, b) => {
            return (a.joinedTimestamp === null ? 0 : a.joinedTimestamp) - (b.joinedTimestamp === null ? 0 : b.joinedTimestamp);
        });
        const join_score =
            join_score_array.findIndex((member) => {
                return member.user.id === command_data.tagged_member.user.id;
            }) + 1;

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        const embedMember = {
            color: 8388736,
            author: {
                name: `Information about user ${command_data.tagged_user.tag}`,
                icon_url: url === null ? undefined : url,
            },
            fields: [
                {
                    name: "??? User ID",
                    value: `${command_data.tagged_user.id}`,
                    inline: true,
                },
                {
                    name: "??? Presence",
                    value: `${presence}`,
                    inline: true,
                },
                {
                    name: "??? Is Bot?",
                    value: `${command_data.tagged_user.bot}`,
                    inline: true,
                },
                {
                    name: "??? Registered",
                    value: `${createdAgo} (${command_data.tagged_user.createdAt.toUTCString()})`,
                },
                {
                    name: "??? Joined",
                    value: `${joinedAgo} (${command_data.tagged_member.joinedAt === null ? "Unknown" : command_data.tagged_member.joinedAt.toUTCString()})`,
                },
                {
                    name: "??? Join Score",
                    value: `${join_score} (${join_score} out of ${join_score_array.length})`,
                },
                {
                    name: `??? Roles [${"??"}]`,
                    value: `${roles}`,
                },
            ],
            thumbnail: {
                url: url === null ? undefined : url,
            },
            footer: {
                text: `Requested by ${command_data.message.author.tag}`,
            },
        };

        command_data.message.channel.send({ embeds: [embedMember] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
} as Command;
