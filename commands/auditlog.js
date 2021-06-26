const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "auditlog",
    category: "Modules",
    description: "Changes logging settings of the server-",
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
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.args.length < 1) {
            var channel0 = "<#" + command_data.server_config.audit_channel + ">";
            if(command_data.server_config.audit_channel === "-1") {
                channel0 = "`None`";
            }

            //Contruct embed
            let embedConfig = {
                title: "Audit Logs",
                description: "To set values see - `" + command_data.server_config.prefix + "help auditlog set`",
                color: 8388736,
                fields: [
                    {
                        name: "Logging Channel:",
                        value: channel0
                    },
                    {
                        name: "Bans:",
                        value: "`" + command_data.server_config.audit_bans + "`",
                        inline: true
                    },
                    {
                        name: "Kicks:",
                        value:  "`" + command_data.server_config.audit_kicks + "`",
                        inline: true
                    },
                    {
                        name: "Mutes:",
                        value:  "`" + command_data.server_config.audit_mutes + "`",
                        inline: true
                    },
                    {
                        name: "Warns:",
                        value:  "`" + command_data.server_config.audit_warns + "`",
                        inline: true
                    },
                    {
                        name: "Nicknames:",
                        value:  "`" + command_data.server_config.audit_nicknames + "`",
                        inline: true
                    },
                    {
                        name: "Deleted Messages:",
                        value:  "`" + command_data.server_config.audit_deletedMessages + "`",
                        inline: true
                    }
                ]
            }

            //Send message
            command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
        } else {
            //Get action
            var action = command_data.args[0];

            switch(action) {
                case "set": {
                    //Argument check
                    if(command_data.args.length < 2) {
                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to set `value` to- (Check `" + command_data.server_config.prefix + "help config set` for help)", "set bans true") }).catch(e => { console.log(e); });
                        return;
                    }
                    var property = command_data.args[1];

                    if(command_data.args.length < 3) {
                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a new value for `" + property + "`-", "set " + property + " <newValue>") }).catch(e => { console.log(e); });
                        return;
                    }
                    var value = command_data.args[2];
                    //var valueText = msg.content.substring(msg.content.indexOf(value));

                    //Edit property's value (and check if value is valid)
                    switch(property) {
                        case "bans": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_bans = bool2;
                            break;
                        }

                        case "kicks": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_kicks = bool2;
                            break;
                        }

                        case "mutes": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_mutes = bool2;
                            break;
                        }

                        case "nicknames": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_nicknames = bool2;
                            break;
                        }

                        case "deletedMessages": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_deletedMessages = bool2;
                            break;
                        }

                        case "editedmessages": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_editedMessages = bool2;
                            break;
                        }

                        case "warns": {
                            const bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                            if(typeof bool2 !== "boolean") {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_warns = bool2;
                            break;
                        }

                        case "audit_channel":
                            value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                            if(data.msg.guild.channels.cache.has(value) === false) {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (channel mention)", "set " + property + " #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                return;
                            }

                            command_data.server_config.audit_channel = value;
                            break;

                        default:
                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `set`- (Check `" + command_data.server_config.prefix + "help auditlog set` for help)", "set bans true") }).catch(e => { console.log(e); });
                            return;
                    }

                    //Save edited config
                    command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                    command_data.msg.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                    break;
                }

                default:
                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `set`)", "set bans true") }).catch(e => { console.log(e); });
                    break;
            }
        }
    },
};