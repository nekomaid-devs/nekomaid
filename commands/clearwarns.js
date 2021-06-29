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
        let warn_reason = "None";
        if(command_data.args.length > 1) {
            warnReason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1)
        }

        let warns = command_data.serverWarns.filter(warn =>
            warn.userID === command_data.tagged_user.id
        )
        command_data.msg.channel.send(`Cleared warnings of \`${command_data.tagged_user.tag}\` (Reason: \`${warn_reason}\`, Strikes: \`${warns.length}\` => \`0\`)-`).catch(e => { console.log(e); });

        if(command_data.server_config.audit_warns == true && command_data.server_config.audit_channel != "-1") {
            let channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let embedClearWarns = {
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
                            value: command_data.msg.author,
                            inline: true
                        },
                        {
                            name: "Reason:",
                            value: warn_reason
                        },
                        {
                            name: "Strikes:",
                            value: `${warns.length} => 0`
                        }
                    ]
                }

                command_data.server_config.caseID += 1;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                channel.send("", { embed: embedClearWarns }).catch(e => { console.log(e); });
            }
        }

        command_data.global_context.neko_modules_clients.ssm.server_remove.removeServerWarningsFromUser(command_data.global_context.neko_modules_clients.ssm, command_data.msg.guild, command_data.msg.author);
    }
};