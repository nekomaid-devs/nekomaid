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
        // TODO: re-factor command
        var warnReason = "None";
        if(command_data.args.length > 1) {
            warnReason = data.msg.content.substring(data.msg.content.indexOf(command_data.args[0]) + command_data.args[0].length + 1)
        }

        //Get server config
        var numOfWarns = data.serverWarns.filter(warn =>
            warn.userID === command_data.tagged_user.id
        ).length
        
        command_data.msg.channel.send("Warned `" + command_data.tagged_user.tag + "` (Reason: `" + warnReason + "`, Strikes: `" + numOfWarns + "` => `" + (numOfWarns + 1) + "`)-").catch(e => { console.log(e); });

        if(command_data.server_config.audit_warns == true && command_data.server_config.audit_channel != "-1") {
            const channel = await command_data.msg.guild.channels.fetch(command_data.server_config.audit_channel).catch(e => { console.log(e); });

            if(channel !== undefined) {
                const embedWarn = {
                    author: {
                        name: "Case " + command_data.server_config.caseID + "# | Warn | " + command_data.tagged_user.tag,
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
                            value: numOfWarns + " => " + (numOfWarns + 1)
                        }
                    ]
                }

                //Save edited config
                command_data.server_config.caseID += 1;
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                channel.send("", { embed: embedWarn }).catch(e => { console.log(e); });
            }
        }

        //Construct serverBan
        var serverWarn = {
            id: data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: command_data.msg.guild.id,
            userID: command_data.tagged_user.id,
            start: Date.now(),
            reason: warnReason
        }

        data.bot.ssm.server_add.addServerWarning(data.bot.ssm, serverWarn, command_data.msg.guild);
    }
};