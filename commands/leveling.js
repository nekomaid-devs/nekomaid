const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "leveling",
    category: "Modules",
    description: "Changes settings of the leveling module.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set enabled true",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("view",
    "`<subcommand_prefix> ranks` - Views all defined ranks")
    .set("add",
    "`<subcommand_prefix> rank [rankName] [levelRequirement] [roleName]` - Adds a rank\n" +
    "`<subcommand_prefix> ignoredChannel [channelMention]` - Adds a channel to ignore in the leveling module-")
    .set("remove",
    "`<subcommand_prefix> rank [rankName]` - Removes a rank\n" + 
    "`<subcommand_prefix> ignoredChannel [channelMention]` - Removes a channel to ignore in the leveling module-")
    .set("set",
    "`<subcommand_prefix> enabled [true/false]` - Enables/Disables the leveling module\n" +
    "`<subcommand_prefix> levelupMessages [true/false]` - Enables/Disables levelup messages\n" +
    "`<subcommand_prefix> levelupMessages_format [text]` - Changes the levelup message (include <user> and <level> in your message to show username and level)\n" +
    "`<subcommand_prefix> levelupMessages_channel [channelMention]` - Changes the channel for levelup messages\n" +
    "`<subcommand_prefix> levelupMessages_ping [true/false]` - Enables/Disables mentions in levelup messages\n\n" +
    "`<subcommand_prefix> message_exp [number]` - Changes the XP gotten from each message\n" +
    "`<subcommand_prefix> level_exp [number]` - Changes the XP required for a level\n" +
    "`<subcommand_prefix> level_multiplier [number]` - Changes the multiplier with which each level increases required XP"),
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
            let channel = `<#${command_data.server_config.module_level_levelupMessages_channel}>`;
            if(command_data.server_config.module_level_levelupMessages_channel === "-1") {
                channel = command_data.server_config.module_level_enabled == true && command_data.server_config.module_level_levelupMessages == true ? "`None❗`" : "`None`";
            }

            let ignored_channels_text = "";
            for(let i = 0; i < command_data.server_config.module_level_ignoredChannels.length; i++) {
                let channel_ID = command_data.server_config.module_level_ignoredChannels[i];
                let channel = await command_data.bot.channels.fetch(channelID).catch(e => { console.log(e); });
                if(channel === undefined) {
                    ignored_channels_text += "`" + channel_ID + "`";
                } else {
                    ignored_channels_text += channel;
                }

                if(command_data.server_config.module_level_ignoredChannels.length - 1 > i) {
                    ignored_channels_text += ", ";
                }
            }
            if(command_data.server_config.module_level_ignoredChannels.length === 0) {
                ignored_channels_text = "`None`";
            }

            let embedLevel = {
                title: "Leveling Module",
                description: `To view values see - \`${command_data.server_config.prefix}help leveling view\`\nTo set values see - \`${command_data.server_config.prefix}help leveling set\`\nTo add values see - \`${command_data.server_config.prefix}help leveling add\`\nTo remove values see - \`${command_data.server_config.prefix}help leveling remove\``,
                color: 8388736,
                fields: [
                    {
                        name: "Status:",
                        value: `${command_data.server_config.module_level_enabled}`
                    },
                    {
                        name: "Level-up messages:",
                        value: `\`${command_data.server_config.module_level_levelupMessages}\` (Channel: ${channel})`
                    },
                    {
                        name: "Level-up format:",
                        value: `\`${command_data.server_config.module_level_levelupMessages_format}\` (Mention: \`${command_data.server_config.module_level_levelupMessages_ping}\`)`
                    },
                    {
                        name: "Level-up settings:",
                        value: `Message XP: \`${command_data.server_config.module_level_message_exp}\` (Level XP: \`${command_data.server_config.module_level_level_exp}\`, Multiplier \`${command_data.server_config.module_level_level_multiplier}x\`)`
                    },
                    {
                        name: "Ignored channels:",
                        value: ignored_channels_text
                    }
                ]
            }

            command_data.msg.channel.send("", { embed: embedLevel }).catch(e => { console.log(e); });
            return;
        }

        let action = command_data.args[0];
        switch(action) {
            case "view": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to view- (Check \`${command_data.server_config.prefix}help leveling view\` for help)`, `view ranks`) }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "ranks": {
                        let ranks = command_data.server_config.module_level_ranks;
                        let embedRanks = new command_data.global_context.modules.Discord.MessageEmbed()
                        .setColor(8388736)
                        .setTitle(`❯ Ranks (${ranks.length})`);

                        for(let i = 0; i < ranks.length; i++) {
                            let rank = ranks[i];
                            let role = await command_data.msg.guild.roles.fetch(rank.roleID).catch(e => { console.log(e); });
                            if(role === undefined) {
                                command_data.msg.reply("There was an error in fetching Role-");
                                return;
                            }

                            embedRanks.addField(`Rank#${rank.name} - ${rank.level}`, `Role - \`${role.name}\``);
                        }

                        command_data.msg.channel.send("", { embed: embedRanks }).catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`view\`- (Check \`${command_data.server_config.prefix}help leveling view\` for help)`, "view ranks") }).catch(e => { console.log(e); });
                        return;
                    }
                }
                break;
            }

            case "add": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.server_config.prefix}help leveling add\` for help)`, `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "rank": {
                        if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                            command_data.msg.channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `rankName`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }
                        let rank_name = command_data.args[2];
                        let does_exist = false;
                        command_data.server_config.module_level_ranks.forEach((rank) => {
                            if(rank.name === rank_name) {
                                does_exist = true;
                            }
                        });
                        if(does_exist === true) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Rank with name \`${rank_name}\` already exists`, "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 4) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `levelRequirement`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }
                        let level_requirement = parseInt(command_data.args[3]);
                        if(isNaN(level_requirement) || level_requirement <= 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid value for `levelRequirement` (number)", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }

                        if(command_data.args.length < 5) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }
                        let role_name = command_data.msg.content.substring(command_data.msg.content.indexOf(command_data.args[4], command_data.msg.content.indexOf(command_data.args[3]) + command_data.args[3].length));
                        let role = command_data.msg.guild.roles.cache.find(roleTemp =>
                            roleTemp.name === role_name
                        );
                        if(role === undefined) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No role with name \`${role_name}\` found`, "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_ranks.push({ id: command_data.global_context.modules.crypto.randomBytes(16).toString("hex"), serverID: command_data.msg.guild.id, name: rank_name, level: level_requirement, roleID: role.id });
                        command_data.msg.channel.send("Added rank `" + rank_name + "` for level `" + level_requirement + "` with role `" + role_name + "`-").catch(e => { console.log(e); });
                        break;
                    }

                    case "ignoredChannel": {
                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `channelMention` (channel mention)", `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }
                        let channel = command_data.args[2];
                        channel = channel.includes("<#") ? channel.replace("<#", "").replace(">", "") : channel;
                        // TODO: this won't work
                        if(command_data.msg.guild.channels.cache.has(channel) === false) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid value for `channelMention` (channel mention)", `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }

                        // TODO: this won't work (checks wrongly or maybe parses the list wrongly idk)
                        let i = 0;
                        let channel_index = -1;
                        command_data.server_config.module_level_ignoredChannels.forEach((channel) => {
                            if(channel.id === channel) {
                                channel_index = i;
                            }
                            i += 1;
                        });
                        if(channel_index > 0) {
                            command_data.msg.channel.send(`Channel ${command_data.args[2]} is already ignored-`).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_ignoredChannels.push(channel);
                        command_data.msg.channel.send(`Added ${channel} to ignored channels-`).catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help leveling add\` for help)`, `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help leveling remove\` for help)`, `remove ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                switch(property) {
                    case "rank": {
                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `rankName`.", "remove rank Trusted") }).catch(e => { console.log(e); });
                            return;
                        }
                        let rank_name = command_data.args[2];
                        let rank_ID = -1;
                        command_data.server_config.module_level_ranks.forEach(function(rank) {
                            if(rank.name === rank_name) {
                                rank_ID = rank.id;
                            }
                        });
                        if(rank_ID === -1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `No rank with name \`${rankName}\` found`, "remove rank Trusted") }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.global_context.neko_modules_clients.ssm.server_remove.remove_rank(command_data.global_context, rankID);
                        command_data.msg.channel.send(`Removed rank \`${rank_name}\`-`);
                        break;
                    }

                    case "ignoredChannel": {
                        if(command_data.args.length < 3) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "You need to enter a `channelMention` (channel mention)", `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }
                        let channel = command_data.args[2];
                        channel = channel.includes("<#") ? channel.replace("<#", "").replace(">", "") : channel;
                        // TODO: this won't work
                        if(command_data.msg.guild.channels.cache.has(channel) === false) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid value for `channelMention` (channel mention)", `add ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                            return;
                        }

                        let i = 0;
                        let channel_index = -1;
                        command_data.server_config.module_level_ignoredChannels.forEach((channel) => {
                            if(channel.id === channel) {
                                channel_index = i;
                            }
                            i += 1;
                        });
                        if(channel_index < 0) {
                            command_data.msg.channel.send(`Channel ${command_data.args[2]} is not ignored-`).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_ignoredChannels.splice(channel_index, 1);
                        command_data.msg.channel.send(`Removed ${channel} from ignored channels-`).catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help leveling remove\` for help)`, `remove ignoredChannel #${command_data.msg.channel.name}`) }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "set": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to set \`value\` to- (Check \`${command_data.server_config.prefix}help leveling set\` for help)`, "set enabled true") }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a new value for \`${property}\`-`, `set ${property} <new_value>`) }).catch(e => { console.log(e); });
                    return;
                }
                let value = command_data.args[2];
                let value_text = command_data.msg.content.substring(command_data.msg.content.indexOf(value));

                switch(property) {
                    case "enabled": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_enabled = bool;
                        break;
                    }

                    case "levelupMessages": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_levelupMessages = bool;
                        break;
                    }

                    case "levelupMessages_format": {
                        if(typeof(value) !== "string" || value.length < 1) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (text)`, `set ${property} <user> just got level <level>!`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = value_text;
                        command_data.server_config.module_level_levelupMessages_format = value;
                        break;
                    }

                    case "levelupMessages_channel": {
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

                        command_data.server_config.module_level_levelupMessages_channel = value;
                        break;
                    }

                    case "levelupMessages_ping": {
                        let bool = value === "true" ? true : (value === "false" ? false : value);
                        if(typeof(bool) !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (true/false)`, `set ${property} true`) }).catch(e => { console.log(e); });
                            return;
                        }

                        command_data.server_config.module_level_levelupMessages_ping = bool;
                        break;
                    }

                    case "message_exp": {
                        if(isNaN(value) || parseFloat(value) <= 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (number)`, `set ${property} 2`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = parseFloat(value);
                        command_data.server_config.module_level_message_exp = value;
                        break;
                    }

                    case "level_exp": {
                        if(isNaN(value) || parseFloat(value) <= 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (number)`, `set ${property} 200`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = parseFloat(value);
                        command_data.server_config.module_level_level_exp = value;
                        break;
                    }

                    case "level_multiplier": {
                        if(isNaN(value) || parseFloat(value) <= 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`- (number)`, `set ${property} 1.3`) }).catch(e => { console.log(e); });
                            return;
                        }

                        value = parseFloat(value);
                        command_data.server_config.module_level_level_multiplier = value;
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help leveling set\` for help)`, "set enabled true") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                command_data.msg.channel.send(`Set bot's property \`${property}\` to \`${value}\``).catch(e => { console.log(e); });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `view`, `add`, `set`, `remove`)", "set enabled true") }).catch(e => { console.log(e); });
                break;
            }
        }
    },
};