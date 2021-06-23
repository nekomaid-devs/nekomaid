const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'auditlog',
    category: 'Modules',
    description: 'Changes logging settings of the server-',
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set bans true",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("set",
    "`<subcommand_prefix> bans [true/false]` - Enables/Disables logging bans\n" + 
    "`<subcommand_prefix> kicks [true/false]` - Enables/Disables logging kicks\n" + 
    "`<subcommand_prefix> mutes [true/false]` - Enables/Disables logging mutes\n\n" +
    "`<subcommand_prefix> nicknames [true/false]` - Enables/Disables logging nickname changes\n\n" +
    "`<subcommand_prefix> deletedMessages [true/false]` - Enables/Disables logging deleted messages\n\n" +
    "`<subcommand_prefix> audit_channel [channelMention]` - Changes the channel for logging"),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD"),
        new NeededPermission("me", "VIEW_AUDIT_LOG")
    ],
    nsfw: false,
    execute(data) {
        if(data.args.length < 1) {
            var channel0 = "<#" + data.serverConfig.audit_channel + ">";
            if(data.serverConfig.audit_channel === "-1") {
                channel0 = "`None`";
            }

            //Contruct embed
            var embedConfig = {
                title: `Audit Logs`,
                description: "To set values see - `" + data.serverConfig.prefix + "help auditlog set`",
                color: 8388736,
                fields: [
                    {
                        name: "Logging Channel:",
                        value: channel0
                    },
                    {
                        name: "Bans:",
                        value: "`" + data.serverConfig.audit_bans + "`",
                        inline: true
                    },
                    {
                        name: "Kicks:",
                        value:  "`" + data.serverConfig.audit_kicks + "`",
                        inline: true
                    },
                    {
                        name: "Mutes:",
                        value:  "`" + data.serverConfig.audit_mutes + "`",
                        inline: true
                    },
                    {
                        name: "Warns:",
                        value:  "`" + data.serverConfig.audit_warns + "`",
                        inline: true
                    },
                    {
                        name: "Nicknames:",
                        value:  "`" + data.serverConfig.audit_nicknames + "`",
                        inline: true
                    },
                    {
                        name: "Deleted Messages:",
                        value:  "`" + data.serverConfig.audit_deletedMessages + "`",
                        inline: true
                    }
                ]
            }

            //Send message
            data.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
        } else {
            //Get action
            var action = data.args[0];

            switch(action) {
                case "set": {
                    //Argument check
                    if(data.args.length < 2) {
                        data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "You need to enter a `property` to set `value` to- (Check `" + data.serverConfig.prefix + "help config set` for help)", "set bans true") }).catch(e => { console.log(e); });
                        return;
                    }
                    var property = data.args[1];

                    if(data.args.length < 3) {
                        data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "You need to enter a new value for `" + property + "`-", "set " + property + " <newValue>") }).catch(e => { console.log(e); });
                        return;
                    }
                    var value = data.args[2];
                    //var valueText = msg.content.substring(msg.content.indexOf(value));

                    //Edit property's value (and check if value is valid)
                    switch(property) {
                        case "bans": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_bans = bool2;
                            break;
                        }

                        case "kicks": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_kicks = bool2;
                            break;
                        }

                        case "mutes": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_mutes = bool2;
                            break;
                        }

                        case "nicknames": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_nicknames = bool2;
                            break;
                        }

                        case "deletedMessages": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_deletedMessages = bool2;
                            break;
                        }

                        case "editedmessages": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_editedMessages = bool2;
                            break;
                        }

                        case "warns": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_warns = bool2;
                            break;
                        }

                        case "audit_channel":
                            value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                            if(data.msg.guild.channels.cache.has(value) === false) {
                                data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (channel mention)", "set " + property + " #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                return;
                            }

                            data.serverConfig.audit_channel = value;
                            break;

                        default:
                            data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid property for `set`- (Check `" + data.serverConfig.prefix + "help auditlog set` for help)", "set bans true") }).catch(e => { console.log(e); });
                            return;
                    }

                    //Save edited config
                    data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });
                    data.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                    break;
                }

                default:
                    data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid action- (Actions: `set`)", "set bans true") }).catch(e => { console.log(e); });
                    break;
            }
        }
    },
};