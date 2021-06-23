const NeededArgument = require("../scripts/helpers/needed_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'warn',
    category: 'Moderation',
    description: 'Warns the tagged user-',
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
    async execute(data) {
        var warnReason = "None";
        if(data.args.length > 1) {
            warnReason = data.msg.content.substring(data.msg.content.indexOf(data.args[0]) + data.args[0].length + 1)
        }

        //Get server config
        var numOfWarns = data.serverWarns.filter(warn =>
            warn.userID === data.taggedUser.id
        ).length
        
        data.channel.send("Warned `" + data.taggedUserTag + "` (Reason: `" + warnReason + "`, Strikes: `" + numOfWarns + "` => `" + (numOfWarns + 1) + "`)-").catch(e => { console.log(e); });

        if(data.serverConfig.audit_warns == true && data.serverConfig.audit_channel != "-1") {
            const channel = await data.guild.channels.fetch(data.serverConfig.audit_channel).catch(e => { console.log(e); });

            if(channel !== undefined) {
                const embedWarn = {
                    author: {
                        name: "Case " + data.serverConfig.caseID + "# | Warn | " + data.taggedUserTag,
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
                            value: numOfWarns + " => " + (numOfWarns + 1)
                        }
                    ]
                }

                //Save edited config
                data.serverConfig.caseID += 1;
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });

                channel.send("", { embed: embedWarn }).catch(e => { console.log(e); });
            }
        }

        //Construct serverBan
        var serverWarn = {
            id: data.bot.crypto.randomBytes(16).toString("hex"),
            serverID: data.guild.id,
            userID: data.taggedUser.id,
            start: Date.now(),
            reason: warnReason
        }

        data.bot.ssm.server_add.addServerWarning(data.bot.ssm, serverWarn, data.guild);
    }
};