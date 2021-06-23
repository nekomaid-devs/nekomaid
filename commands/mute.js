const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'mute',
    category: 'Moderation',
    description: 'Mutes the tagged user-',
    helpUsage: "[mention] [?time] [?reason]` *(2 optional arguments)*",
    exampleUsage: "/userTag/ 6h Posting invites",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "MANAGE_ROLES"),
        new NeededPermission("me", "MANAGE_CHANNELS")
    ],
    nsfw: false,
    async execute(data) {
        var time = data.args.length < 2 ? -1 : (data.args[1] === -1 ? -1 : data.bot.tc.convertString(data.args[1]));
        if(time != -1 && time.status != 1) {
            data.reply("You entered invalid time format (ex. `1d2h3m4s` or `-1`)-");
            return;
        }

        if(data.taggedMember.bannable === false) {
            data.reply("Couldn't mute `" + data.taggedUserTag + "` (Try moving Nekomaid's permissions above the user you want to mute)-");
            return;
        }

        var muteReason = "None";
        if(data.args.length > 2) {
            muteReason = data.msg.content.substring(data.msg.content.indexOf(data.args[1]) + data.args[1].length + 1)
        }

        //Get server config
        var previousMute = -1;
        data.serverMutes.forEach(function(mute) {
            if(mute.userID === data.taggedUser.id) {
                previousMute = mute;
            }
        });

        var muteStart = Date.now();
        var muteEnd = -1;
        var extendedTime = (time.days * 86400000) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000);
        var extendedTimeText = time === -1 ? "Forever" : data.bot.tc.convertTime(extendedTime);

        if(previousMute === -1) {
            muteEnd = muteStart + extendedTime;
            const muteEndText = time === -1 ? "Forever" : data.bot.tc.convertTime(muteEnd - muteStart);

            data.channel.send("Muted `" + data.taggedUserTag + "` for `" + extendedTimeText + "` (Reason: `" + muteReason + "`, Time: `" + muteEndText + "`)-").catch(e => { console.log(e); });

            if(data.serverConfig.audit_mutes == true && data.serverConfig.audit_channel != "-1") {
                const channel = await data.guild.channels.fetch(data.serverConfig.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    const embedMute = {
                        author: {
                            name: "Case " + data.serverConfig.caseID + "# | Mute | " + data.taggedUserTag,
                            icon_url: data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: data.taggedUser,
                                inline: true
                            },
                            {
                                name: "Moderator:",
                                value: data.authorUser,
                                inline: true
                            },
                            {
                                name: "Reason:",
                                value: muteReason
                            },
                            {
                                name: "Duration:",
                                value: muteEndText
                            }
                        ]
                    }

                    //Save edited config
                    data.serverConfig.caseID += 1;
                    data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        } else {
            muteEnd = previousMute.end + extendedTime;
            const muteEnd0Text = previousMute.end === 1 ? "Forever" : data.bot.tc.convertTime(previousMute.end - muteStart);
            const muteEndText = time === -1 ? "Forever" : data.bot.tc.convertTime(muteEnd - muteStart);
            
            data.channel.send("Extended mute of `" + data.taggedUserTag + "` by `" + extendedTimeText + "` (Reason: `" + muteReason + "`, Time: `" + muteEndText + "`)-").catch(e => { console.log(e); });

            if(data.serverConfig.audit_mutes == true && data.serverConfig.audit_channel != "-1") {
                var channel = await data.guild.channels.fetch(data.serverConfig.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    const embedMute = {
                        author: {
                            name: "Case " + data.serverConfig.caseID + "# | Mute Extension | " + data.taggedUserTag,
                            icon_url: data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: data.taggedUser,
                                inline: true
                            },
                            {
                                name: "Moderator:",
                                value: data.authorUser,
                                inline: true
                            },
                            {
                                name: "Reason:",
                                value: muteReason
                            },
                            {
                                name: "Duration:",
                                value: muteEnd0Text + " -> " + muteEndText
                            }
                        ]
                    }

                    //Save edited config
                    data.serverConfig.caseID += 1;
                    data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        }

        //Construct serverMute
        var serverMute = {
            id: data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: data.guild.id,
            userID: data.taggedUser.id,
            start: muteStart,
            reason: muteReason,
            end: time === -1 ? -1 : muteEnd
        }

        if(data.serverConfig.muteRoleID === "-1") {
            this.createMuteRoleAndMute(data, data.msg, data.taggedMember);
        } else {
            var muteRole = await data.guild.roles.fetch(data.serverConfig.muteRoleID).catch(e => { console.log(e); });

            if(muteRole === undefined) {
                this.createMuteRoleAndMute(data, data.msg, data.taggedMember);
            } else {
                data.taggedMember.roles.add(muteRole);
            }
        }

        data.bot.ssm.server_add.addServerMute(data.bot.ssm, serverMute);
    },

    createMuteRoleAndMute(data, msg, taggedUser) {
        msg.guild.roles.create({
            data: {
                name: "Muted",
                color: "#4b4b4b",
                hoist: true,
                mentionable: false,
                permissions: []
            }
        }).then(muteRole => {
            msg.guild.channels.cache.forEach(channel => {
                try {
                    if(channel.type === "text") {
                        channel.createOverwrite(muteRole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    } else if(channel.type === "voice") {
                        channel.createOverwrite(muteRole, {
                            CONNECT: false,
                            SPEAK: false
                        }).catch(e => { console.log(e); });
                    }
                } catch(err) {
                    console.log("[mod] Skipped a permission overwrite because I didn't have permission-")
                }
            })

            taggedUser.roles.add(muteRole)
            .then(function() {
                data.serverConfig.muteRoleID = muteRole.id;
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: msg.guild.id, server: data.serverConfig });
            })
            .catch(err => {
                console.error(err);
                msg.channel.reply("Couldn't mute `" + taggedUser.user.username + "#" + taggedUser.user.discriminator + "` (Try moving Nekomaid's permissions above the user you want to mute)-");
            });
        })
    }
};