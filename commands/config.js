const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "config",
    category: "Modules",
    description: "Changes settings of the server.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set welcome_messages true",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> auto_role [roleName]` - Adds auto role\n" +
    "`<subcommand_prefix> counter [all_members/members/roles/channels/bots]` - Adds a counter")
    .set("remove",
    "`<subcommand_prefix> auto_role [roleName]` - Removes auto role")
    .set("set",
    "`<subcommand_prefix> say_command [true/false]` - Enables/Disables the say command\n\n" + 
    "`<subcommand_prefix> welcome_messages [true/false]` - Enables/Disables welcome messages\n" + 
    "`<subcommand_prefix> welcome_messages_format [text]` - Changes the welcome message (include <user> in your message to show username)\n" +
    "`<subcommand_prefix> welcome_messages_channel [channel_mention]` - Changes the channel for welcome messages\n" +
    "`<subcommand_prefix> welcome_messages_ping [true/false]` - Enables/Disables mentions in welcome messages\n\n" +
    "`<subcommand_prefix> leave_messages [true/false]` - Enables/Disables leave messages\n" +
    "`<subcommand_prefix> leave_messages_format [text]` - Changes the leave message (include <user> in your message to show username)\n" +
    "`<subcommand_prefix> leave_messages_channel [channel_mention]` - Changes the channel for leave messages"),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data) {
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        if(command_data.args.length < 1) {
            let channel_1 = `<#${command_data.server_config.welcome_messages_channel}>`;
            if(command_data.server_config.welcome_messages_channel === "-1") {
                channel_1 = command_data.server_config.welcome_messages == true ? "`None❗`" : "`None`";
            }

            let channel_2 = `<#${command_data.server_config.leave_messages_channel}>`;
            if(command_data.server_config.leave_messages_channel === "-1") {
                channel_2 = command_data.server_config.leave_messages == true ? "`None❗`" : "`None`";
            }

            let auto_roles_text = "";
            for(let i = 0; i < command_data.server_config.auto_roles.length; i++) {
                let role_ID = command_data.server_config.auto_roles[i];
                let role = await command_data.msg.guild.roles.fetch(role_ID).catch(e => { command_data.global_context.logger.api_error(e); });
                if(role === undefined) {
                    auto_roles_text += "`" + role_ID + "`";
                } else {
                    auto_roles_text += "`" + role.name + "`";
                }

                if(command_data.server_config.auto_roles.length - 1 > i) {
                    auto_roles_text += ", ";
                }
            }
            if(command_data.server_config.auto_roles.length === 0) {
                auto_roles_text = "`None`";
            }

            let embedConfig = {
                title: "Config",
                description: `To set values see - \`${command_data.server_config.prefix}help config set\`\nTo add values see - \`${command_data.server_config.prefix}help config add\`\nTo remove values see - \`${command_data.server_config.prefix}help config remove\``,
                color: 8388736,
                fields: [
                    {
                        name: "Welcome Messages:",
                        value: `\`${command_data.server_config.welcome_messages}\` (Channel: ${channel_1})`
                    },
                    {
                        name: "Welcome Format:",
                        value: `\`${command_data.server_config.welcome_messages_format}\` (Mention: \`${command_data.server_config.welcome_messages_ping}\`)`
                    },
                    {
                        name: "Leave Messages:",
                        value: `\`${command_data.server_config.leave_messages}\` (Channel: ${channel_2})`
                    },
                    {
                        name: "Leave Format:",
                        value: `${command_data.server_config.leave_messages_format}`
                    },
                    {
                        name: "Auto-roles:",
                        value: auto_roles_text
                    },
                    {
                        name: "Counters:",
                        value: command_data.server_config.counters.length
                    }
                ]
            }

            command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { command_data.global_context.logger.api_error(e); });
            return;
        }

        let action = command_data.args[0];
        switch(action) {
            case "add": {
                if(command_data.args.length < 2) {
                    command_data.msg.reply(`You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.server_config.prefix}help config add\` for help)`);
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "auto_role": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`.", "add auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }
                        let role_name = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[2], command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                        let role = command_data.msg.guild.roles.cache.find(role_temp =>
                            role_temp.name === role_name
                        );
                        if(role === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No role with name .\`${role_name}\` found-`, "add auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.auto_roles.push(role.id);
                        command_data.msg.channel.send(`Added auto-role \`${role_name}\`.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "counter": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_CHANNELS") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Channels`\nPlease add required permissions and try again-").catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `type`. (Types: `allMembers`, `members`, `roles`, `channels`, `bots`)", "add counter allMembers") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        let channel = -1;
                        let counter_type = command_data.args[2];
                        switch(counter_type) {
                            case "all_members":
                            case "members":
                            case "roles":
                            case "channels":
                            case "bots":
                            case "bot_servers":
                            case "bot_users": {
                                channel = await command_data.msg.guild.channels.create("Loading...", {
                                    type: "voice",
                                    position: 0,
                                    permissionOverwrites: [
                                        {
                                            id: command_data.msg.guild.roles.everyone,
                                            deny: "CONNECT",
                                            type: "role"
                                        },
                                        {
                                            id: command_data.msg.guild.me.user.id,
                                            allow: "MANAGE_CHANNELS",
                                            type: "member"
                                        },
                                        {
                                            id: command_data.msg.guild.me.user.id,
                                            allow: "CONNECT",
                                            type: "member"
                                        }
                                    ]
                                });
                                break;
                            }

                            default: {
                                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid counter `type`- (Types: `all_members`, `members`, `roles`, `channels`, `bots`)", "add counter all_members") }).catch(e => { command_data.global_context.logger.api_error(e); });
                                return;
                            }
                        }

                        setTimeout(() => { command_data.global_context.neko_modules_clients.cm.update_counters(command_data.global_context, command_data.msg.guild, true); }, 5000);
                        command_data.server_config.counters.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), type: counter_type, server_ID: command_data.msg.guild.id, channel_ID: channel.id, last_update: new Date().getTime() });
                        command_data.msg.channel.send(`Added new counter, wait for it to load.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help config add\` for help)`, "add auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, `remove ${property} <value>`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "auto_role": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, `remove ${property} <value>`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }
                        let role_name = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[2], command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                        let role = command_data.msg.guild.roles.cache.find(role_temp =>
                            role_temp.name === role_name
                        );
                        if(role === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No role with name \`${roleName}\` found-`, "remove auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        let i = 0;
                        let role_index = -1;
                        command_data.server_config.auto_roles.forEach((role_ID) => {
                            if(role.id === role_ID) {
                                role_index = i;
                            }
                            i += 1;
                        });
                        if(role_index < 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No \`auto_role\` with name \`${role_name}\` found-`, "remove auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.auto_roles.splice(role_index, 1);
                        command_data.msg.channel.send(`Removed auto-role \`${role_name}\`.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, "remove auto_role Newbie") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "set": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to set \`value\` to- (Check \`${command_data.server_config.prefix}help config set\` for help)`, "set welcome_messages true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a new value for \`${property}\`-`, "set " + property + " <newValue>") }).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }
                let value = command_data.args[2];
                let value_text = command_data.msg.content.substring(command_data.msg.content.indexOf(value));

                switch(property) {
                    case "say_command": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.say_command = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} the say command.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "welcome_messages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.welcome_messages = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} welcome messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "welcome_messages_format": {
                        if(typeof(value) !== "string" || value.length < 1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (text)`, `set ${property} Welcome <user>!`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        value = value_text;
                        command_data.server_config.welcome_messages_format = value;
                        command_data.msg.channel.send(`Edited the welcome messages format.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "leave_messages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.leave_messages = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} leave messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "leave_messages_format": {
                        if(typeof(value) !== "string" || value.length < 1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (text)`, `set ${property} Farawell <user>!`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        value = value_text;
                        command_data.server_config.leave_messages_format = value;
                        command_data.msg.channel.send(`Edited the leave messages format.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "welcome_messages_channel": {
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

                        command_data.server_config.welcome_messages_channel = value;
                        command_data.msg.channel.send(`Set welcome messages channel to <#${value}>.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "leave_messages_channel": {
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

                        command_data.server_config.leave_messages_channel = value;
                        command_data.msg.channel.send(`Set leave messages channel to <#${value}>.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    case "welcome_messages_ping": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (true/false)`, `set ${property} true`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.welcome_messages_ping = bool;
                        command_data.msg.channel.send(`${bool ? "Enabled" : "Disabled"} pings in welcome messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help config set\` for help)`, "set welcome_messages true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "set welcome_messages true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                return;
            }
        }

        if(command_data.server_config.welcome_messages == true && command_data.server_config.welcome_messages_channel === "-1") {
            command_data.msg.channel.send("Make sure to set `welcome_messages_channel`, otherwise welcome messages won't work.").catch(e => { command_data.global_context.logger.api_error(e); });
        }

        if(command_data.server_config.leave_messages == true && command_data.server_config.leave_messages_channel === "-1") {
            command_data.msg.channel.send("Make sure to set `leave_messages_channel`, otherwise leave messages won't work.").catch(e => { command_data.global_context.logger.api_error(e); });
        }
    },
};