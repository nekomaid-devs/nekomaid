const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "config",
    category: "Modules",
    description: "Changes settings of the server.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set welcomeMessages true",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> autoRole [roleName]` - Adds auto role\n" +
    "`<subcommand_prefix> counter [allMembers/members/roles/channels/bots]` - Adds a counter")
    .set("remove",
    "`<subcommand_prefix> autoRole [roleName]` - Removes auto role")
    .set("set",
    "`<subcommand_prefix> sayCommand [true/false]` - Enables/Disables the say command\n\n" + 
    "`<subcommand_prefix> welcomeMessages [true/false]` - Enables/Disables welcome messages\n" + 
    "`<subcommand_prefix> welcomeMessages_format [text]` - Changes the welcome message (include <user> in your message to show username)\n" +
    "`<subcommand_prefix> welcomeMessages_channel [channelMention]` - Changes the channel for welcome messages\n" +
    "`<subcommand_prefix> welcomeMessages_ping [true/false]` - Enables/Disables mentions in welcome messages\n\n" +
    "`<subcommand_prefix> leaveMessages [true/false]` - Enables/Disables leave messages\n" +
    "`<subcommand_prefix> leaveMessages_format [text]` - Changes the leave message (include <user> in your message to show username)\n" +
    "`<subcommand_prefix> leaveMessages_channel [channelMention]` - Changes the channel for leave messages"),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: normalize names of settings
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        if(command_data.args.length < 1) {
            let channel_1 = `<#${command_data.server_config.welcomeMessages_channel}>`;
            if(command_data.server_config.welcomeMessages_channel === "-1") {
                channel_1 = command_data.server_config.welcomeMessages == true ? "`None❗`" : "`None`";
            }

            let channel_2 = `<#${command_data.server_config.leaveMessages_channel}>`;
            if(command_data.server_config.leaveMessages_channel === "-1") {
                channel_2 = command_data.server_config.leaveMessages == true ? "`None❗`" : "`None`";
            }

            let auto_roles_text = "";
            for(let i = 0; i < command_data.server_config.autoRoles.length; i++) {
                let role_ID = command_data.server_config.autoRoles[i];
                let role = await command_data.msg.guild.roles.fetch(role_ID).catch(e => { console.log(e); });
                if(role === undefined) {
                    auto_roles_text += "`" + role_ID + "`";
                } else {
                    auto_roles_text += "`" + role.name + "`";
                }

                if(command_data.server_config.autoRoles.length - 1 > i) {
                    auto_roles_text += ", ";
                }
            }
            if(command_data.server_config.autoRoles.length === 0) {
                auto_roles_text = "`None`";
            }

            let embedConfig = {
                title: "Config",
                description: `To set values see - \`${command_data.server_config.prefix}help config set\`\nTo add values see - \`${command_data.server_config.prefix}help config add\`\nTo remove values see - \`${command_data.server_config.prefix}help config remove\``,
                color: 8388736,
                fields: [
                    {
                        name: "Welcome Messages:",
                        value: `\`${command_data.server_config.welcomeMessages}\` (Channel: ${channel_1})`
                    },
                    {
                        name: "Welcome Format:",
                        value: `\`${command_data.server_config.welcomeMessages_format}\` (Mention: \`${command_data.server_config.welcomeMessages_ping}\`)`
                    },
                    {
                        name: "Leave Messages:",
                        value: `\`${command_data.server_config.leaveMessages}\` (Channel: ${channel_2})`
                    },
                    {
                        name: "Leave Format:",
                        value: `${command_data.server_config.leaveMessages_format}`
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

            command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
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
                    case "autoRole": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`.", "add autoRole Newbie") }).catch(e => { console.log(e); });
                            return;
                        }
                        let role_name = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[2], command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                        let role = command_data.msg.guild.roles.cache.find(role_temp =>
                            role_temp.name === role_name
                        );
                        if(role === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No role with name .\`${role_name}\` found-`, "add autoRole Newbie") }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.autoRoles.push(role.id);
                        command_data.msg.channel.send(`Added auto role \`${role_name}\`-`).catch(e => { console.log(e); });
                        break;
                    }

                    case "counter": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_CHANNELS") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Channels`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `type`- (Types: `allMembers`, `members`, `roles`, `channels`, `bots`)", "add counter allMembers") }).catch(e => { console.log(e); });
                            return;
                        }

                        let channel = -1;
                        let counter_type = command_data.args[2];
                        switch(counter_type) {
                            case "allMembers":
                            case "members":
                            case "roles":
                            case "channels":
                            case "bots":
                            case "botServers":
                            case "botUsers": {
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
                                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid counter `type`- (Types: `allMembers`,`members`,`roles`,`channels`,`bots`)", "add counter allMembers") }).catch(e => { console.log(e); });
                                return;
                            }
                        }

                        setTimeout(() => { command_data.global_context.neko_modules_clients.cm.update_counters(command_data.global_context, command_data.msg.guild, true); }, 5000);
                        command_data.server_config.counters.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), type: counter_type, serverID: command_data.msg.guild.id, channelID: channel.id, lastUpdate: new Date().toUTCString() });
                        command_data.msg.channel.send(`Added new counter for \`${counter_type}\`.`).catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help config add\` for help)`, "add autoRole Newbie") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, `remove ${property} <value>`) }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "autoRole": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, `remove ${property} <value>`) }).catch(e => { console.log(e); });
                            return;
                        }
                        let role_name = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[2], command_data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                        let role = command_data.msg.guild.roles.cache.find(role_temp =>
                            role_temp.name === role_name
                        );
                        if(role === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No role with name \`${roleName}\` found-`, "remove autoRole Newbie") }).catch(e => { console.log(e); });
                            return;
                        }

                        let i = 0;
                        let role_index = -1;
                        command_data.server_config.autoRoles.forEach((role_ID) => {
                            if(role.id === role_ID) {
                                role_index = i;
                            }
                            i += 1;
                        });
                        if(role_index < 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No \`autoRole\` with name \`${role_name}\` found-`, "remove autoRole Newbie") }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.autoRoles.splice(role_index, 1);
                        command_data.msg.channel.send(`Removed auto role \`${role_name}\`-`).catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help config remove\` for help)`, "remove autoRole Newbie") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "set": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to set \`value\` to- (Check \`${command_data.server_config.prefix}help config set\` for help)`, "set welcomeMessages true") }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a new value for \`${property}\`-`, "set " + property + " <newValue>") }).catch(e => { console.log(e); });
                    return;
                }
                let value = command_data.args[2];
                let value_text = command_data.msg.content.substring(command_data.msg.content.indexOf(value));

                switch(property) {
                    case "sayCommand": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.sayCommand = bool;
                        break;
                    }

                    case "welcomeMessages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.welcomeMessages = bool;
                        break;
                    }

                    case "welcomeMessages_format": {
                        if(typeof(value) !== "string" || value.length < 1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (text)`, `set ${property} Welcome <user>!`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = value_text;
                        command_data.server_config.welcomeMessages_format = value;
                        break;
                    }

                    case "leaveMessages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.leaveMessages = bool;
                        break;
                    }

                    case "leaveMessages_format": {
                        if(typeof(value) !== "string" || value.length < 1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (text)`, `set ${property} Farawell <user>!`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = value_text;
                        command_data.server_config.leaveMessages_format = value;
                        break;
                    }

                    case "welcomeMessages_channel": {
                        value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;
                        let channel = await command_data.msg.guild.channels.fetch(value).catch(e => { console.log(e); });
                        if(channel === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (channel mention)`, `set ${property} #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }

                        if(channel.permissionsFor(command_data.global_context.bot.user).has("VIEW_CHANNEL") === false || channel.permissionsFor(command_data.global_context.bot.user).has("SEND_MESSAGES") === false) {
                            command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                            return;
                        }

                        command_data.server_config.welcomeMessages_channel = value;
                        break;
                    }

                    case "leaveMessages_channel": {
                        value = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;
                        let channel = await command_data.msg.guild.channels.fetch(value).catch(e => { console.log(e); });
                        if(channel === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (channel mention)`, `set ${property} #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }

                        if(channel.permissionsFor(command_data.global_context.bot.user).has("VIEW_CHANNEL") === false || channel.permissionsFor(command_data.global_context.bot.user).has("SEND_MESSAGES") === false) {
                            command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                            return;
                        }

                        command_data.server_config.leaveMessages_channel = value;
                        break;
                    }

                    case "welcomeMessages_ping": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.welcomeMessages_ping = bool;
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help config set\` for help)`, "set welcomeMessages true") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                command_data.msg.channel.send(`Set bot's property \`${property}\` to \`${value}\``).catch(e => { console.log(e); });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "set welcomeMessages true") }).catch(e => { console.log(e); });
                return;
            }
        }

        if(command_data.server_config.welcomeMessages == true && command_data.server_config.welcomeMessages_channel === "-1") {
            command_data.msg.channel.send("Make sure to set `welcomeMessages_channel`, otherwise welcome messages won't work-").catch(e => { console.log(e); });
        }

        if(command_data.server_config.leaveMessages == true && command_data.server_config.leaveMessages_channel === "-1") {
            command_data.msg.channel.send("Make sure to set `leaveMessages_channel`, otherwise leave messages won't work-").catch(e => { console.log(e); });
        }
    },
};