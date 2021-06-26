const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Mutes the tagged user-",
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
    async execute(command_data) {
        // TODO: re-factor command
        var time = command_data.args.length < 2 ? -1 : (command_data.args[1] === -1 ? -1 : command_data.global_context.neko_modules_clients.tc.convertString(command_data.args[1]));
        if(time != -1 && time.status != 1) {
            command_data.msg.reply("You entered invalid time format (ex. `1d2h3m4s` or `-1`)-");
            return;
        }

        if(command_data.tagged_member.bannable === false) {
            command_data.msg.reply("Couldn't mute `" + command_data.tagged_user.tag + "` (Try moving Nekomaid's permissions above the user you want to mute)-");
            return;
        }

        var muteReason = "None";
        if(command_data.args.length > 2) {
            muteReason = data.msg.content.substring(data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1)
        }

        //Get server config
        var previousMute = -1;
        data.serverMutes.forEach(function(mute) {
            if(mute.userID === command_data.tagged_user.id) {
                previousMute = mute;
            }
        });

        var muteStart = Date.now();
        var muteEnd = -1;
        var extendedTime = (time.days * 86400000) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000);
        var extendedTimeText = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convertTime(extendedTime);

        if(previousMute === -1) {
            muteEnd = muteStart + extendedTime;
            const muteEndText = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convertTime(muteEnd - muteStart);

            command_data.msg.channel.send("Muted `" + command_data.tagged_user.tag + "` for `" + extendedTimeText + "` (Reason: `" + muteReason + "`, Time: `" + muteEndText + "`)-").catch(e => { console.log(e); });

            if(command_data.server_config.audit_mutes == true && command_data.server_config.audit_channel != "-1") {
                const channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    const embedMute = {
                        author: {
                            name: "Case " + command_data.server_config.caseID + "# | Mute | " + command_data.tagged_user.tag,
                            icon_url: command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: command_data.tagged_user,
                                inline: true
                            },
                            {
                                name: "Moderator:",
                                value: command_data.msg.author,
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
                    command_data.server_config.caseID += 1;
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        } else {
            muteEnd = previousMute.end + extendedTime;
            const muteEnd0Text = previousMute.end === 1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convertTime(previousMute.end - muteStart);
            const muteEndText = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convertTime(muteEnd - muteStart);
            
            command_data.msg.channel.send("Extended mute of `" + command_data.tagged_user.tag + "` by `" + extendedTimeText + "` (Reason: `" + muteReason + "`, Time: `" + muteEndText + "`)-").catch(e => { console.log(e); });

            if(command_data.server_config.audit_mutes == true && command_data.server_config.audit_channel != "-1") {
                var channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    const embedMute = {
                        author: {
                            name: "Case " + command_data.server_config.caseID + "# | Mute Extension | " + command_data.tagged_user.tag,
                            icon_url: command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 }),
                        },
                        fields: [
                            {
                                name: "User:",
                                value: command_data.tagged_user,
                                inline: true
                            },
                            {
                                name: "Moderator:",
                                value: command_data.msg.author,
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
                    command_data.server_config.caseID += 1;
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        }

        //Construct serverMute
        var serverMute = {
            id: data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: command_data.msg.guild.id,
            userID: command_data.tagged_user.id,
            start: muteStart,
            reason: muteReason,
            end: time === -1 ? -1 : muteEnd
        }

        if(command_data.server_config.muteRoleID === "-1") {
            this.createMuteRoleAndMute(data, data.msg, command_data.tagged_member);
        } else {
            var muteRole = await command_data.msg.guild.roles.fetch(command_data.server_config.muteRoleID).catch(e => { console.log(e); });

            if(muteRole === undefined) {
                this.createMuteRoleAndMute(data, data.msg, command_data.tagged_member);
            } else {
                command_data.tagged_member.roles.add(muteRole);
            }
        }

        command_data.global_context.neko_modules_clients.ssm.server_add.addServerMute(command_data.global_context.neko_modules_clients.ssm, serverMute);
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
                command_data.server_config.muteRoleID = muteRole.id;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: msg.guild.id, server: command_data.server_config });
            })
            .catch(err => {
                console.error(err);
                msg.channel.reply("Couldn't mute `" + taggedUser.user.username + "#" + taggedUser.user.discriminator + "` (Try moving Nekomaid's permissions above the user you want to mute)-");
            });
        })
    }
};