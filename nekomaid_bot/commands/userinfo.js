module.exports = {
    name: 'userinfo',
    category: 'Utility',
    description: "Displays information about the tagged user-",
    helpUsage: "[mention?]` *(optional argument)*",
    hidden: false,
    aliases: ["memberinfo"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var end = new Date();
        var start = new Date(data.taggedUser.createdAt.toUTCString());
        var elapsed = end - start;
        var createdAgo = data.bot.tc.convertTime(elapsed);

        start = new Date(data.taggedMember.joinedAt.toUTCString());
        elapsed = end - start;
        var joinedAgo = data.bot.tc.convertTime(elapsed);

        var roles = ""
        var rolesArray = Array.from(data.taggedMember.roles.cache.values())
        rolesArray.forEach((role, index) => {
            roles += role.toString();

            if(rolesArray.length - 1 > index) {
                roles += ", ";
            }
        });

        var presence = ""
        switch(data.taggedUser.presence.status) {
            case "online": {
                presence = "Online <:n_online:725010541352976414>"
                break;
            }

            case "idle": {
                presence = "Idle <:n_idle:725010594222178395>"
                break;
            }

            case "offline": {
                presence = "Offline <:n_offline:725010693526388738>"
                break;
            }

            case "dnd": {
                presence = "Do not Disturb <:n_dnd:725010643366707333>"
                break;
            }
        }

        var joinedScoreArray = Array.from(data.guild.members.cache.values()).sort(function(a, b) { return a.joinedTimestamp - b.joinedTimestamp })
        var joinScore = -1;
        var joinScore2 = "th";
        var joinScoreMax = data.guild.members.cache.size;
        var i = 1;
        joinedScoreArray.forEach(member => {
            if(member.user.id === data.taggedMember.user.id) {
                joinScore = i
            }

            i += 1;
        });

        switch(joinScore) {
            case 1:
                joinScore2 = "st";
                break;

            case 2:
                joinScore2 = "nd";
                break;

            case 3:
                joinScore2 = "rd";
                break;
        }

        //Construct embed
        var avatarUrl = data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 });

        var embedMember = {
            color: 8388736,
            author: {
                name: "Information about user " + data.taggedUserTag,
                icon_url: avatarUrl
            },
            fields: [ 
                    {
                        name: '❯ User ID',
                        value: `${data.taggedUser.id}`,
                        inline: true
                    },
                    {
                        name: '❯ Presence',
                        value: `${presence}`,
                        inline: true
                    },
                    {
                        name: '❯ Is Bot?',
                        value: `${data.taggedUser.bot}`,
                        inline: true
                    },
                    {
                        name: '❯ Registered',
                        value: `${createdAgo} (${data.taggedUser.createdAt.toUTCString()})`
                    },
                    {
                        name: '❯ Joined',
                        value: `${joinedAgo} (${data.taggedMember.joinedAt.toUTCString()})`
                    },
                    {
                        name: '❯ Join Score',
                        value: `${joinScore} (${joinScore}${joinScore2} out of ${joinScoreMax})`
                    },
                    {
                        name: '❯ Roles [' + data.taggedMember.roles.cache.size + ']',
                        value: `${roles}`
                    }
            ],
            thumbnail: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${data.authorTag}`
            },
        }

        //Send message
        data.channel.send("", { embed: embedMember }).catch(e => { console.log(e); });
    },
};