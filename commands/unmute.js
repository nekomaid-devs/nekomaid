const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes the tagged user-",
    helpUsage: "[mention] [?reason]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS"),
        new NeededPermission("me", "MANAGE_ROLES")
    ],
    nsfw: false,
    async execute(command_data) {
        if(command_data.tagged_user.bannable === false) {
            command_data.msg.reply(`Couldn't unmute \`${command_data.tagged_user.tag}\` (Try moving Nekomaid's permissions above the user you want to unmute)-`);
            return;
        }

        let unmute_reason = "None";
        if(command_data.args.length > 1) {
            unmute_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[1]))
        }

        let previous_mute_ID = -1;
        command_data.server_mutes.forEach((mute) => {
            if(mute.userID === command_data.tagged_user.id) {
                previous_mute_ID = mute.id;
            }
        });

        if(previous_mute_ID === -1) {
            command_data.msg.reply(`\`${command_data.tagged_user.tag}\` isn't muted-`);
        } else {
            if(command_data.msg.guild.roles.cache.has(command_data.server_config.muteRoleID) === false) {
                command_data.msg.reply("Couldn't find the Muted role- (Did somebody delete it?)-");
                return;
            }
            
            let mute_role = await command_data.msg.guild.roles.fetch(command_data.server_config.muteRoleID).catch(e => { console.log(e); });
            command_data.tagged_member.roles.remove(mute_role);

            command_data.msg.channel.send(`Unmuted \`${command_data.tagged_user.tag}\` (Reason: \`${unmute_reason}\`)`).catch(e => { console.log(e); });
            command_data.global_context.neko_modules_clients.ssm.server_remove.removeServerMute(command_data.global_context, previous_mute_ID);

            // TODO: drop this once a separate callback
            if(command_data.server_config.audit_mutes == true && command_data.server_config.audit_channel != "-1") {
                let channel = await command_data.global_context.bot.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });
                if(channel !== undefined) {
                    let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
                    let embedMute = {
                        author: {
                            name: `Case ${command_data.server_config.caseID}# | Unmute | ${command_data.tagged_user.tag}`,
                            icon_url: url,
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
                                value: unmute_reason
                            }
                        ]
                    }

                    command_data.server_config.caseID += 1;
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                    channel.send("", { embed: embedMute }).catch(e => { console.log(e); });
                }
            }
        }
    }
};