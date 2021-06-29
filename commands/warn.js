const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "warn",
    category: "Moderation",
    description: "Warns the tagged user-",
    helpUsage: "[mention] [?reason]` *(1 optional arguments)*",
    exampleUsage: "/userTag/ Said a bad word",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "BAN_MEMBERS")
    ],
    nsfw: false,
    async execute(command_data) {
        let warn_reason = "None";
        if(command_data.args.length > 1) {
            warn_reason = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1);
        }

        let num_of_warnings = command_data.serverWarns.filter(warn =>
            warn.userID === command_data.tagged_user.id
        ).length;
        command_data.msg.channel.send(`Warned \`${command_data.tagged_user.tag}\` (Reason: \`${warn_reason}\`, Strikes: \`${num_of_warnings}\` => \`${(numOfWarns + 1)}\`)-`).catch(e => { console.log(e); });

        if(command_data.server_config.audit_warns == true && command_data.server_config.audit_channel != "-1") {
            let channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });
            if(channel !== undefined) {
                let embedWarn = {
                    author: {
                        name: `Case ${command_data.server_config.caseID}# | Warn | ${command_data.tagged_user.tag}`,
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
                            value: warnReason
                        },
                        {
                            name: "Strikes:",
                            value: `${num_of_warnings} => ${(num_of_warnings + 1)}`
                        }
                    ]
                }

                command_data.server_config.caseID += 1;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                channel.send("", { embed: embedWarn }).catch(e => { console.log(e); });
            }
        }

        let serverWarn = {
            id: command_data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: command_data.msg.guild.id,
            userID: command_data.tagged_user.id,
            start: Date.now(),
            reason: warnReason
        }

        command_data.global_context.neko_modules_clients.ssm.server_add.addServerWarning(command_data.global_context.neko_modules_clients.ssm, serverWarn, command_data.msg.guild);
    }
};