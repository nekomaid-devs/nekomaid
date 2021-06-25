const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "clearwarns",
    category: "Moderation",
    description: "Clears warnings of the tagged user-",
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
    async execute(command_data) {
        // TODO: re-factor command
        var warnReason = "None";
        if(command_data.args.length > 1) {
            warnReason = data.msg.content.substring(data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1)
        }

        //Get server config
        var warns = data.serverWarns.filter(warn =>
            warn.userID === command_data.tagged_user.id
        )

        command_data.msg.channel.send("Cleared warnings of `" + command_data.tagged_user.tag + "` (Reason: `" + warnReason + "`, Strikes: `" + warns.length + "` => `0`)-").catch(e => { console.log(e); });

        if(command_data.server_config.audit_warns == true && command_data.server_config.audit_channel != "-1") {
            const channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });

            if(channel !== undefined) {
                const embedClearWarns = {
                    author: {
                        name: "Case " + command_data.server_config.caseID + "# | Cleared warnings | " + command_data.tagged_user.tag,
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
                command_data.server_config.caseID += 1;
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                channel.send("", { embed: embedClearWarns }).catch(e => { console.log(e); });
            }
        }

        //Clear warnings
        data.bot.ssm.server_remove.removeServerWarningsFromUser(data.bot.ssm, command_data.msg.guild, data.authorUser);
    }
};