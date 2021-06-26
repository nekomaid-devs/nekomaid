const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "config",
    category: "Modules",
    description: "Changes settings of the server-",
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
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(data.bot, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        if(command_data.args.length < 1) {
                var channel0 = "<#" + command_data.server_config.welcomeMessages_channel + ">";
                if(command_data.server_config.welcomeMessages_channel === "-1") {
                    channel0 = command_data.server_config.welcomeMessages == true ? "`None❗`" : "`None`";
                }

                var channel1 = "<#" + command_data.server_config.leaveMessages_channel + ">";
                if(command_data.server_config.leaveMessages_channel === "-1") {
                    channel1 = command_data.server_config.leaveMessages == true ? "`None❗`" : "`None`";
                }

                var autoRolesText = "";
                for(let i = 0; i < command_data.server_config.autoRoles.length; i++) {
                    var roleID = command_data.server_config.autoRoles[i];
                    var role = await command_data.msg.guild.roles.fetch(roleID).catch(e => { console.log(e); });

                    if(role === undefined) {
                        autoRolesText += "`" + roleID + "`";
                    } else {
                        autoRolesText += "`" + role.name + "`";
                    }

                    if(command_data.server_config.autoRoles.length - 1 > i) {
                        autoRolesText += ", ";
                    }
                }

                if(command_data.server_config.autoRoles.length === 0) {
                    autoRolesText = "`None`";
                }

                //Contruct embed
                let embedConfig = {
                    title: "Config",
                    description: "To set values see - `" + command_data.server_config.prefix + "help config set`\nTo add values see - `" + command_data.server_config.prefix + "help config add`\nTo remove values see - `" + command_data.server_config.prefix + "help config remove`",
                    color: 8388736,
                    fields: [
                        {
                            name: "Welcome Messages:",
                            value: "`" + command_data.server_config.welcomeMessages + "` (Channel: " + channel0 + ")"
                        },
                        {
                            name: "Welcome Format:",
                            value: "`" + command_data.server_config.welcomeMessages_format + "` (Mention: `" + command_data.server_config.welcomeMessages_ping + "`)"
                        },
                        {
                            name: "Leave Messages:",
                            value: "`" + command_data.server_config.leaveMessages + "` (Channel: " + channel1 + ")"
                        },
                        {
                            name: "Leave Format:",
                            value: "`" + command_data.server_config.leaveMessages_format + "`"
                        },
                        {
                            name: "Auto-roles:",
                            value: autoRolesText
                        },
                        {
                            name: "Counters:",
                            value: command_data.server_config.counters.length
                        }
                    ]
                }

                //Send message
                command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
        } else {
                //Get action
                var action = command_data.args[0];

                switch(action) {
                        case "add": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                    data.msg.reply("You need to enter a `property` to add a `value` to- (Check `" + command_data.server_config.prefix + "help config add` for help)");
                                    return;
                                }
                                const property = command_data.args[1];

                                switch(property) {
                                        case "autoRole": {
                                            //Permission check
                                            if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                                                let channel = await data.msg.guild.channels.cache.fetch(command_data.server_config.module_level_levelup_channelID);
                                                channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                                                return;
                                            }

                                            if(command_data.args.length < 3) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`-", "add autoRole Newbie") }).catch(e => { console.log(e); });
                                                return;
                                            }
                                            var roleName = data.msg.content.substring(data.msg.content.indexOf(command_data.args[2], data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                                            var role = command_data.msg.guild.roles.cache.find(roleTemp =>
                                                roleTemp.name === roleName
                                            );
                                            if(role === undefined) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "No role with name `" + roleName + "` found-", "add autoRole Newbie") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.autoRoles.push(role.id);
                                            command_data.msg.channel.send("Added role `" + roleName + "` to auto roles-").catch(e => { console.log(e); });
                                            break;
                                        }

                                        case "counter": {
                                                //Permission check
                                                if(command_data.msg.guild.me.hasPermission("MANAGE_CHANNELS") === false) {
                                                    let channel = await data.msg.guild.channels.cache.fetch(command_data.server_config.module_level_levelup_channelID);
                                                    channel.send("The bot doesn't have required permissions to do this - `Manage Channels`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                                                    return;
                                                }

                                                if(command_data.args.length < 3) {
                                                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `type`- (Types: `allMembers`,`members`,`roles`,`channels`,`bots`)", "add counter allMembers") }).catch(e => { console.log(e); });
                                                    return;
                                                }
                                                var counterType = command_data.args[2]
                                                var channel = -1
                                                switch(counterType) {
                                                        case "allMembers":
                                                            channel = await command_data.msg.guild.channels.create("All Members: " + command_data.msg.guild.memberCount, {
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
                                                            })
                                                            break;

                                                        case "members": {
                                                            let memberCount = 0;
                                                            command_data.msg.guild.members.cache.forEach(member => {
                                                                if(member.user.bot === false) {
                                                                    memberCount += 1;
                                                                }
                                                            })

                                                            channel = await command_data.msg.guild.channels.create("Members: " + memberCount, {
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
                                                            })
                                                            break;
                                                        }

                                                        case "roles":
                                                            channel = await command_data.msg.guild.channels.create("Roles: " + command_data.msg.guild.roles.size, {
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
                                                            })
                                                            break;

                                                        case "channels":
                                                            channel = await command_data.msg.guild.channels.create("Channels: " + command_data.msg.guild.channels.size, {
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
                                                            })
                                                            break;

                                                        case "bots":
                                                            var botCount = 0;
                                                            command_data.msg.guild.members.cache.forEach(member => {
                                                                if(member.user.bot === true) {
                                                                    botCount += 1;
                                                                }
                                                            })

                                                            channel = await command_data.msg.guild.channels.create("Bots: " + botCount, {
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
                                                            })
                                                            break;

                                                        case "botServers":
                                                            var guildCount = 0;
                                                            await data.bot.shard.fetchClientValues('guilds.cache.size')
                                                                .then(results => {
                                                                guildCount = results.reduce((prev, guildCount) =>
                                                                    prev + guildCount, 0
                                                                );
                                                            });

                                                            channel = await command_data.msg.guild.channels.create("Current Servers: " + guildCount, {
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
                                                            })
                                                            break;

                                                        case "botUsers": {
                                                            let memberCount = 0;
                                                            await data.bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
                                                                .then(results => {
                                                                memberCount = results.reduce((prev, memberCount) =>
                                                                    prev + memberCount, 0
                                                                );
                                                            });

                                                            channel = await command_data.msg.guild.channels.create("Current Users: " + memberCount, {
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
                                                            })
                                                            break;
                                                        }

                                                        default:
                                                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid counter `type`- (Types: `allMembers`,`members`,`roles`,`channels`,`bots`)", "add counter allMembers") }).catch(e => { console.log(e); });
                                                            return;
                                                }

                                                command_data.server_config.counters.push({ id: data.bot.crypto.randomBytes(16).toString("hex"), type: counterType, serverID: command_data.msg.guild.id, channelID: channel.id, lastUpdate: new Date().toUTCString() });
                                                command_data.msg.channel.send("Added new counter for `" + counterType + "`-").catch(e => { console.log(e); });
                                                break;
                                        }

                                        default:
                                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `add`- (Check `" + command_data.server_config.prefix + "help config add` for help)", "add autoRole Newbie") }).catch(e => { console.log(e); });
                                            return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                                break;
                        }

                        case "remove": {
                            //Argument check
                            if(command_data.args.length < 2) {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to remove a `value` from- (Check `" + command_data.server_config.prefix + "help config remove` for help)", "remove " + property + " <value>") }).catch(e => { console.log(e); });
                                return;
                            }
                            const property = command_data.args[1];

                            switch(property) {
                                case "autoRole": {
                                    //Permission check
                                    if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                                        var channel = await command_data.msg.guild.channels.fetch(command_data.server_config.module_level_levelup_channelID).catch(e => { console.log(e); });
                                        channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                                        return;
                                    }

                                    //Argument check
                                    if(command_data.args.length < 3) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`-", "remove autoRole Newbie") }).catch(e => { console.log(e); });
                                        return;
                                    }
                                    const roleName = data.msg.content.substring(data.msg.content.indexOf(command_data.args[2], data.msg.content.indexOf(command_data.args[1]) + command_data.args[1].length));
                                    const role = command_data.msg.guild.roles.cache.find(roleTemp =>
                                        roleTemp.name === roleName || roleTemp.id === roleName
                                    );
                                    if(role === undefined) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "No role with name `" + roleName + "` found-", "remove autoRole Newbie") }).catch(e => { console.log(e); });
                                        return;
                                    }

                                    let i = 0;
                                    let roleIndex = -1;
                                    command_data.server_config.autoRoles.forEach(function(roleID) {
                                        if(role.id === roleID) {
                                            roleIndex = i;
                                        }

                                        i += 1;
                                    });

                                    if(roleIndex < 0) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "No `autoRole` with name `" + roleName + "` found-", "remove autoRole Newbie") }).catch(e => { console.log(e); });
                                        return;
                                    }

                                    command_data.server_config.autoRoles.splice(roleIndex, 1);
                                    command_data.msg.channel.send("Removed auto role `" + roleName + "`-").catch(e => { console.log(e); });
                                    break;
                                }

                                default:
                                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `remove`- (Check `" + command_data.server_config.prefix + "help config remove` for help)", "remove autoRole Newbie") }).catch(e => { console.log(e); });
                                    return;
                            }

                            //Save edited config
                            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                            break;
                        }

                        case "set": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to set `value` to- (Check `" + command_data.server_config.prefix + "help config set` for help)", "set welcomeMessages true") }).catch(e => { console.log(e); });
                                    return;
                                }
                                var property = command_data.args[1];

                                if(command_data.args.length < 3) {
                                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a new value for `" + property + "`-", "set " + property + " <newValue>") }).catch(e => { console.log(e); });
                                    return;
                                }
                                var value = command_data.args[2];
                                var valueText = data.msg.content.substring(data.msg.content.indexOf(value));

                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                        case "osuAnnouncements_channel": {
                                            const value2 = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                                            if(command_data.msg.guild.channels.cache.has(value2) === false) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (channel mention)", "set " + property + " #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            var channel = await command_data.msg.guild.channels.fetch(value2).catch(e => { console.log(e); });
                                            if(channel
                                            .permissionsFor(data.bot.user)
                                            .has("VIEW_CHANNEL") === false ||
                                            channel
                                            .permissionsFor(data.bot.user)
                                            .has("SEND_MESSAGES") === false) {
                                                command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                                                return;
                                            }

                                            command_data.server_config.osuAnnouncements_channel = value2;
                                            break;
                                        }

                                        case "sayCommand":
                                            var bool0 = value === 'true' ? true : (value === 'false' ? false : value);

                                            if(typeof bool0 !== "boolean") {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.sayCommand = bool0;
                                            break;

                                        case "welcomeMessages":
                                            var bool = value === 'true' ? true : (value === 'false' ? false : value);

                                            if(typeof bool !== "boolean") {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.welcomeMessages = bool;
                                            break;

                                        case "welcomeMessages_format":
                                            if(typeof value !== "string" || value.length < 1) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.welcomeMessages_format = valueText;
                                            value = valueText;
                                            break;

                                        case "leaveMessages":
                                            var bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                                            if(typeof bool2 !== "boolean") {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.leaveMessages = bool2;
                                            break;

                                        case "leaveMessages_format":
                                            if(typeof value !== "string" || value.length < 1) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (text)", "set " + property + " Farawell <user>!") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.leaveMessages_format = valueText;
                                            value = valueText;
                                            break;

                                        case "welcomeMessages_channel": {
                                            const value2 = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                                            if(command_data.msg.guild.channels.cache.has(value2) === false) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (channel mention)", "set " + property + " #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            var channel = await command_data.msg.guild.channels.fetch(value2).catch(e => { console.log(e); });
                                            if(channel
                                            .permissionsFor(data.bot.user)
                                            .has("VIEW_CHANNEL") === false ||
                                            channel
                                            .permissionsFor(data.bot.user)
                                            .has("SEND_MESSAGES") === false) {
                                                command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                                                return;
                                            }

                                            command_data.server_config.welcomeMessages_channel = value2;
                                            break;
                                        }

                                        case "leaveMessages_channel": {
                                            const value2 = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                                            if(command_data.msg.guild.channels.cache.has(value2) === false) {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (channel mention)", "set " + property + " #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            var channel = await command_data.msg.guild.channels.fetch(value2).catch(e => { console.log(e); });
                                            if(channel
                                            .permissionsFor(data.bot.user)
                                            .has("VIEW_CHANNEL") === false ||
                                            channel
                                            .permissionsFor(data.bot.user)
                                            .has("SEND_MESSAGES") === false) {
                                                command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                                                return;
                                            }

                                            command_data.server_config.leaveMessages_channel = value2;
                                            break;
                                        }

                                        case "welcomeMessages_ping":
                                            var bool3 = value === 'true' ? true : (value === 'false' ? false : value);

                                            if(typeof bool3 !== "boolean") {
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                return;
                                            }

                                            command_data.server_config.welcomeMessages_ping = bool3;
                                            break;

                                        default:
                                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `set`- (Check `" + command_data.server_config.prefix + "help config set` for help)", "set welcomeMessages true") }).catch(e => { console.log(e); });
                                            return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                                command_data.msg.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                                break;
                        }

                        default:
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`,`set`,`remove`)", "set welcomeMessages true") }).catch(e => { console.log(e); });
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