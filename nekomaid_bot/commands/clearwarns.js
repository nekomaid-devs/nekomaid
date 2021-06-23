const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'clearwarns',
    category: 'Moderation',
    description: 'Clears warnings of the tagged user-',
    helpUsage: "[mention] [?reason]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention an user-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    async execute(data) {
        var warnReason = "None";
        if(data.args.length > 1) {
            warnReason = data.msg.content.substring(data.msg.content.indexOf(data.args[0]) + data.args[0].length + 1)
        }

        //Get server config
        var warns = data.serverWarns.filter(warn =>
            warn.userID === data.taggedUser.id
        )

        data.channel.send("Cleared warnings of `" + data.taggedUserTag + "` (Reason: `" + warnReason + "`, Strikes: `" + warns.length + "` => `0`)-").catch(e => { console.log(e); });

        if(data.serverConfig.audit_warns == true && data.serverConfig.audit_channel != "-1") {
            const channel = await data.guild.channels.fetch(data.serverConfig.audit_channel).catch(e => { console.log(e); });

            if(channel !== undefined) {
                const embedClearWarns = {
                    author: {
                        name: "Case " + data.serverConfig.caseID + "# | Cleared warnings | " + data.taggedUserTag,
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
                            value: warnReason
                        },
                        {
                            name: "Strikes:",
                            value: warns.length + " => 0"
                        }
                    ]
                }

                //Save edited config
                data.serverConfig.caseID += 1;
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });

                channel.send("", { embed: embedClearWarns }).catch(e => { console.log(e); });
            }
        }

        //Clear warnings
        data.bot.ssm.server_remove.removeServerWarningsFromUser(data.bot.ssm, data.guild, data.authorUser);
    }
};