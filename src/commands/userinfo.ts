/* Types */
import { CommandData } from "../ts/types";

/* Local Imports */
import RecommendedArgument from "../scripts/helpers/recommended_argument";

export default {
    name: "userinfo",
    category: "Utility",
    description: "Displays information about the tagged user.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["memberinfo"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [new RecommendedArgument(1, "Argument needs to be a mention.", "mention")],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null) {
            return;
        }
        const presence = "Online <:n_online:725010541352976414>";
        const elapsedCreated = new Date().getTime() - command_data.tagged_user.createdAt.getTime();
        const createdAgo = command_data.global_context.neko_modules.timeConvert.convert_time(elapsedCreated);

        const elapsedJoined = command_data.tagged_member.joinedAt === null ? 0 : new Date().getTime() - command_data.tagged_member.joinedAt.getTime();
        const joinedAgo = command_data.global_context.neko_modules.timeConvert.convert_time(elapsedJoined);

        let roles = Array.from(command_data.tagged_member.roles.cache.values()).reduce((acc, curr) => {
            acc += curr.toString() + ", ";
            return acc;
        }, "");
        roles = roles.slice(0, roles.length - 2);
        if (roles === "") {
            roles = "`None`";
        }

        const join_score_array = Array.from(command_data.msg.guild.members.cache.values()).sort((a, b) => {
            return (a.joinedTimestamp === null ? 0 : a.joinedTimestamp) - (b.joinedTimestamp === null ? 0 : b.joinedTimestamp);
        });
        const join_score =
            join_score_array.findIndex((member) => {
                return member.user.id === command_data.tagged_member.user.id;
            }) + 1;
        const join_score_max = command_data.msg.guild.members.cache.size;

        const url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        if (url === null) {
            return;
        }
        const embedMember = {
            color: 8388736,
            author: {
                name: "Information about user " + command_data.tagged_user.tag,
                icon_url: url,
            },
            fields: [
                {
                    name: "❯ User ID",
                    value: `${command_data.tagged_user.id}`,
                    inline: true,
                },
                {
                    name: "❯ Presence",
                    value: `${presence}`,
                    inline: true,
                },
                {
                    name: "❯ Is Bot?",
                    value: `${command_data.tagged_user.bot}`,
                    inline: true,
                },
                {
                    name: "❯ Registered",
                    value: `${createdAgo} (${command_data.tagged_user.createdAt.toUTCString()})`,
                },
                {
                    name: "❯ Joined",
                    value: `${joinedAgo} (${command_data.tagged_member.joinedAt === null ? "Unknown" : command_data.tagged_member.joinedAt.toUTCString()})`,
                },
                {
                    name: "❯ Join Score",
                    value: `${join_score} (${join_score} out of ${join_score_max})`,
                },
                {
                    name: "❯ Roles [" + command_data.tagged_member.roles.cache.size + "]",
                    value: `${roles}`,
                },
            ],
            thumbnail: {
                url: url,
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`,
            },
        };

        command_data.msg.channel.send({ embeds: [embedMember] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
        });
    },
};
