const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "userinfo",
    category: "Utility",
    description: "Displays information about the tagged user.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["memberinfo"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        let elapsedCreated = new Date() - new Date(command_data.tagged_user.createdAt.toUTCString());
        let createdAgo = command_data.global_context.neko_modules_clients.tc.convert_time(elapsedCreated);

        let elapsedJoined = new Date() - new Date(command_data.tagged_member.joinedAt.toUTCString());
        let joinedAgo = command_data.global_context.neko_modules_clients.tc.convert_time(elapsedJoined);

        let roles = Array.from(command_data.tagged_member.roles.cache.values()).reduce((acc, curr) => { acc += curr.toString() + ", "; return acc; }, "");
        roles = roles.slice(0, roles.length - 2);
        if(roles === "") {
            roles = "`None`";
        }

        let presence = "";
        // TODO: this will always show offline
        switch(command_data.tagged_user.presence.status) {
            case "online": {
                presence = "Online <:n_online:725010541352976414>";
                break;
            }

            case "idle": {
                presence = "Idle <:n_idle:725010594222178395>";
                break;
            }

            case "offline": {
                presence = "Offline <:n_offline:725010693526388738>";
                break;
            }

            case "dnd": {
                presence = "Do not Disturb <:n_dnd:725010643366707333>";
                break;
            }
        }

        await command_data.global_context.utils.verify_guild_members(command_data.msg.guild);
        let join_score_array = Array.from(command_data.msg.guild.members.cache.values()).sort((a, b) => { return a.joinedTimestamp - b.joinedTimestamp });
        let join_score = join_score_array.findIndex(member => { return member.user.id === command_data.tagged_member.user.id }) + 1;
        let join_score_max = command_data.msg.guild.members.cache.size;

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedMember = {
            color: 8388736,
            author: {
                name: "Information about user " + command_data.tagged_user.tag,
                icon_url: url
            },
            fields: [ 
                    {
                        name: '❯ User ID',
                        value: `${command_data.tagged_user.id}`,
                        inline: true
                    },
                    {
                        name: '❯ Presence',
                        value: `${presence}`,
                        inline: true
                    },
                    {
                        name: '❯ Is Bot?',
                        value: `${command_data.tagged_user.bot}`,
                        inline: true
                    },
                    {
                        name: '❯ Registered',
                        value: `${createdAgo} (${command_data.tagged_user.createdAt.toUTCString()})`
                    },
                    {
                        name: '❯ Joined',
                        value: `${joinedAgo} (${command_data.tagged_member.joinedAt.toUTCString()})`
                    },
                    {
                        name: '❯ Join Score',
                        value: `${join_score} (${join_score} out of ${join_score_max})`
                    },
                    {
                        name: '❯ Roles [' + command_data.tagged_member.roles.cache.size + ']',
                        value: `${roles}`
                    }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }

        command_data.msg.channel.send("", { embed: embedMember }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};