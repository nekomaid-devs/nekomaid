module.exports = {
    name: "userinfo",
    category: "Utility",
    description: "Displays information about the tagged user-",
    helpUsage: "[mention?]` *(optional argument)*",
    hidden: false,
    aliases: ["memberinfo"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let elapsedCreated = new Date() - new Date(command_data.tagged_user.createdAt.toUTCString());
        let createdAgo = command_data.global_context.neko_modules_clients.tc.convertTime(elapsedCreated);

        let elapsedJoined = new Date() - new Date(command_data.tagged_member.joinedAt.toUTCString());
        let joinedAgo = command_data.global_context.neko_modules_clients.tc.convertTime(elapsedJoined);

        let roles = "";
        let rolesArray = Array.from(command_data.tagged_member.roles.cache.values());
        rolesArray.forEach((role, index) => {
            roles += role.toString();
            if(rolesArray.length - 1 > index) {
                roles += ", ";
            }
        });

        let presence = "";
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

        let join_score_array = Array.from(command_data.msg.guild.members.cache.values()).sort(function(a, b) { return a.joinedTimestamp - b.joinedTimestamp });
        let join_score = -1;
        let join_score_suffix = "th";
        let join_score_max = command_data.msg.guild.members.cache.size;
        join_score_array.forEach((member, i) => {
            if(member.user.id === command_data.tagged_member.user.id) {
                join_score = i;
            }
        });
        switch(join_score_suffix) {
            case 1:
                join_score_suffix = "st";
                break;

            case 2:
                join_score_suffix = "nd";
                break;

            case 3:
                join_score_suffix = "rd";
                break;
        }

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedMember = {
            color: 8388736,
            author: {
                name: "Information about user " + command_data.tagged_user.tag,
                icon_url: avatarUrl
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
                        value: `${join_score} (${join_score}${join_score_suffix} out of ${join_score_max})`
                    },
                    {
                        name: '❯ Roles [' + data.tagged_member.roles.cache.size + ']',
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

        command_data.msg.channel.send("", { embed: embedMember }).catch(e => { console.log(e); });
    },
};