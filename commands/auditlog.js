const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "auditlog",
    category: "Modules",
    description: "Changes logging settings of the server.",
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
    "`<subcommand_prefix> deleted_messages [true/false]` - Enables/Disables logging deleted messages\n\n" +
    "`<subcommand_prefix> audit_channel [channel_mention]` - Changes the channel for logging"),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD"),
        new NeededPermission("me", "VIEW_AUDIT_LOG")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        if(command_data.args.length < 1) {
            let channel = `<#${command_data.server_config.audit_channel}>`;
            if(command_data.server_config.audit_channel === "-1") {
                channel = "`None`";
            }

            let embedConfig = {
                title: "Audit Logs",
                description: `To set values see - \`${command_data.server_config.prefix}help auditlog set\``,
                color: 8388736,
                fields: [
                    {
                        name: "Logging Channel:",
                        value: channel
                    },
                    {
                        name: "Bans:",
                        value: `${command_data.server_config.audit_bans}`,
                        inline: true
                    },
                    {
                        name: "Kicks:",
                        value:  `${command_data.server_config.audit_kicks}`,
                        inline: true
                    },
                    {
                        name: "Mutes:",
                        value:  `${command_data.server_config.audit_mutes}`,
                        inline: true
                    },
                    {
                        name: "Warns:",
                        value:  `${command_data.server_config.audit_warns}`,
                        inline: true
                    },
                    {
                        name: "Nicknames:",
                        value: `${command_data.server_config.audit_nicknames}`,
                        inline: true
                    },
                    {
                        name: "Deleted Messages:",
                        value:  `${command_data.server_config.audit_deleted_messages}`,
                        inline: true
                    }
                ]
            }

            command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let action = command_data.args[0];
        switch(action) {
            case "set": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to set \`value\` to- (Check \`${command_data.server_config.prefix}help auditlog set\` for help)`, "set bans true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a new value for \`${property}\`-`, `set ${property} <new_value>`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }
                let value = command_data.args[2];
                let value_text = command_data.msg.content.substring(command_data.msg.content.indexOf(value));

                switch(property) {
                    case "bans": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_bans = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of bans.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "kicks": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_kicks = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of kicks.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "mutes": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_mutes = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of mutes.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "nicknames": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_nicknames = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of nickname changes.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "deleted_messages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_deleted_messages = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of deleted messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "edited_messages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_edited_messages = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of edited messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "warns": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.audit_warns = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} logging of warnings.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "audit_channel": {
                        value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;
                        let channel = await command_data.msg.guild.channels.fetch(value).catch(e => { command_data.global_context.logger.api_error(e); });
                        if(channel === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (channel mention)`, `set ${property} #${command_data.msg.channel.name}`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        if(channel.permissionsFor(command_data.global_context.bot.user).has("VIEW_CHANNEL") === false || channel.permissionsFor(command_data.global_context.bot.user).has("SEND_MESSAGES") === false) {
                            command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again.");
                            return;
                        }

                        command_data.server_config.audit_channel = value;
                        command_data.msg.channel.send(`Set audit channel to <#${value}>.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help auditlog set\` for help)`, "set bans true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `set`)", "set bans true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                break;
            }
        }
    },
};