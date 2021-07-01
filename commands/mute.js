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
        // TODO: previous mutes don't get removed btw
        let time = command_data.args.length < 2 ? -1 : (command_data.args[1] === -1 ? -1 : command_data.global_context.neko_modules_clients.tc.convert_string_to_time_data(command_data.args[1]));
        if(time != -1 && time.status != 1) {
            command_data.msg.reply("You entered invalid time format (ex. `1d2h3m4s` or `-1`)-");
            return;
        }
        if(command_data.tagged_member.bannable === false) {
            command_data.msg.reply(`Couldn't mute \`${command_data.tagged_user.tag}\` (Try moving Nekomaid's permissions above the user you want to mute)-`);
            return;
        }

        let mute_reason = "None";
        if(command_data.args.length > 2) {
            mute_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length + 1)
        }
        let previous_mute = -1;
        command_data.server_mutes.forEach((mute) => {
            if(mute.userID === command_data.tagged_user.id) {
                previous_mute = mute;
            }
        });

        let mute_start = Date.now();
        let mute_end = -1;
        let extended_time = (time.days * 86400000) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000);
        let extended_time_text = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(extended_time);

        if(previous_mute === -1) {
            mute_end = mute_start + extended_time;
            let mute_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(mute_end - mute_start);
            command_data.msg.channel.send(`Muted \`${command_data.tagged_user.tag}\` for \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch(e => { console.log(e); });

            // TODO: drop this once a separate callback
            if(command_data.server_config.audit_mutes == true && command_data.server_config.audit_channel != "-1") {
                let channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });
                if(channel !== undefined) {
                    let embedMute = {
                        author: {
                            name: `Case ${command_data.server_config.caseID}# | Mute | ${command_data.tagged_user.tag}`,
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
                                value: mute_reason
                            },
                            {
                                name: "Duration:",
                                value: mute_end_text
                            }
                        ]
                    }

                    command_data.server_config.caseID += 1;
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        } else {
            mute_end = previous_mute.end + extended_time;
            let prev_mute_end_text = previous_mute.end === 1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(previous_mute.end - mute_start);
            let mute_end_text = time === -1 ? "Forever" : command_data.global_context.neko_modules_clients.tc.convert_time(mute_end - mute_start);
            command_data.msg.channel.send(`Extended mute of \`${command_data.tagged_user.tag}\` by \`${extended_time_text}\` (Reason: \`${mute_reason}\`, Time: \`${mute_end_text}\`)-`).catch(e => { console.log(e); });

            // TODO: drop this once a separate callback
            if(command_data.server_config.audit_mutes == true && command_data.server_config.audit_channel != "-1") {
                let channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });
                if(channel !== undefined) {
                    let embedMute = {
                        author: {
                            name: `Case ${command_data.server_config.caseID}# | Mute Extension | ${command_data.tagged_user.tag}`,
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
                                value: mute_reason
                            },
                            {
                                name: "Duration:",
                                value: prev_mute_end_text + " -> " + mute_end_text
                            }
                        ]
                    }

                    command_data.server_config.caseID += 1;
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        }

        let server_mute = {
            id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"),
            serverID: command_data.msg.guild.id,
            userID: command_data.tagged_user.id,
            start: mute_start,
            reason: mute_reason,
            end: time === -1 ? -1 : mute_end
        }

        if(command_data.server_config.muteRoleID === "-1") {
            this.create_mute_role_and_mute(command_data);
        } else {
            let mute_role = await command_data.msg.guild.roles.fetch(command_data.server_config.muteRoleID).catch(e => { console.log(e); });
            if(mute_role === undefined) {
                this.create_mute_role_and_mute(command_data);
            } else {
                command_data.tagged_member.roles.add(mute_role);
            }
        }

        command_data.global_context.neko_modules_clients.ssm.server_add.add_server_mute(command_data.global_context, server_mute);
    },

    create_mute_role_and_mute(command_data) {
        command_data.msg.guild.roles.create({
            data: {
                name: "Muted",
                color: "#4b4b4b",
                hoist: true,
                mentionable: false,
                permissions: []
            }
        }).then(mute_role => {
            command_data.msg.guild.channels.cache.forEach(channel => {
                try {
                    if(channel.type === "text") {
                        channel.createOverwrite(mute_role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    } else if(channel.type === "voice") {
                        channel.createOverwrite(mute_role, {
                            CONNECT: false,
                            SPEAK: false
                        }).catch(e => { console.log(e); });
                    }
                } catch(err) {
                    console.log("[mod] Skipped a permission overwrite because I didn't have permission-");
                }
            })

            command_data.tagged_member.roles.add(mute_role)
            .then(() => {
                command_data.server_config.muteRoleID = mute_role.id;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
            })
            .catch(err => {
                console.error(err);
                command_data.msg.reply(`Couldn't mute \`${command_data.tagged_member.user.tag}\` (Try moving Nekomaid's permissions above the user you want to mute)-`);
            });
        })
    }
};