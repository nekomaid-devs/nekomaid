const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'unmute',
    category: 'Moderation',
    description: 'Unmutes the tagged user-',
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
    async execute(data) {
        if(data.taggedUser.bannable === false) {
            data.reply("Couldn't unmute `" + data.taggedUserTag + "` (Try moving Nekomaid's permissions above the user you want to unmute)-");
            return;
        }

        var unmuteReason = "None";
        if(data.args.length > 1) {
            unmuteReason = data.msg.content.substring(data.msg.content.indexOf(data.args[1]))
        }

        //Get server config
        var previousMuteID = -1;
        data.serverMutes.forEach(function(mute) {
            if(mute.userID === data.taggedUser.id) {
                previousMuteID = mute.id;
            }
        });

        if(previousMuteID === -1) {
            data.reply("`" + data.taggedUserTag + "` isn't muted-");
        } else {
            if(data.guild.roles.cache.has(data.serverConfig.muteRoleID) === false) {
                data.reply("Couldn't find the Muted role- (Did somebody delete it?)-");
                return;
            }
            
            var muteRole = await data.guild.roles.fetch(data.serverConfig.muteRoleID).catch(e => { console.log(e); });
            data.taggedMember.roles.remove(muteRole);

            data.channel.send("Unmuted `" + data.taggedUserTag + "` (Reason: `" + unmuteReason + "`)").catch(e => { console.log(e); });
            data.bot.ssm.server_remove.removeServerMute(data.bot.ssm, previousMuteID);

            if(data.serverConfig.audit_mutes == true && data.serverConfig.audit_channel != "-1") {
                var channel = await data.guild.channels.fetch(data.serverConfig.audit_channel).catch(e => { console.log(e); });

                if(channel !== undefined) {
                    var embedMute = {
                        author: {
                            name: "Case " + data.serverConfig.caseID + "# | Unmute | " + data.taggedUserTag,
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
                                value: unmuteReason
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
    }
};