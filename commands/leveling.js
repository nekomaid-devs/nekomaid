const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "leveling",
    category: "Modules",
    description: "Changes settings of the leveling module-",
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
    "`<subcommand_prefix> levelupMessages_format [true/false]` - Changes the levelup message (include <user> and <level> in your message to show username and level)\n" +
    "`<subcommand_prefix> levelupMessages_channel [channelMention]` - Changes the channel for levelup messages\n" +
    "`<subcommand_prefix> levelupMessages_ping [true/false]` - Enables/Disables mentions in levelup messages\n\n" +
    "`<subcommand_prefix> message_exp [number]` - Changes the XP gotten from each message\n" +
    "`<subcommand_prefix> level_exp [number]` - Changes the XP required for a level\n" +
    "`<subcommand_prefix> level_multiplier [number]` - Changes the multiplier with which each level increases required XP"),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        command_data.server_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(data.bot, { type: "server", id: command_data.msg.guild.id, containExtra: true });
        if(command_data.args.length < 1) {
                var channel0 = "<#" + command_data.server_config.module_level_levelupMessages_channel + ">";
                if(command_data.server_config.module_level_levelupMessages_channel === "-1") {
                    channel0 = command_data.server_config.module_level_enabled == true && command_data.server_config.module_level_levelupMessages == true ? "`None❗`" : "`None`";
                }

                var ignoredChannelsText = "";
                for(let i = 0; i < command_data.server_config.module_level_ignoredChannels.length; i++) {
                    var channelID = command_data.server_config.module_level_ignoredChannels[i];
                    var channel = await data.bot.channels.fetch(channelID).catch(e => { console.log(e); });

                    if(channel === undefined) {
                        ignoredChannelsText += "`" + channelID + "`";
                    } else {
                        ignoredChannelsText += channel;
                    }

                    if(command_data.server_config.module_level_ignoredChannels.length - 1 > i) {
                        ignoredChannelsText += ", ";
                    }
                }

                if(command_data.server_config.module_level_ignoredChannels.length === 0) {
                    ignoredChannelsText = "`None`";
                }

                //Contruct embed
                let embedLevel = {
                    title: "Leveling Module",
                    description: "To view values see - `" + command_data.server_config.prefix + "help leveling view`\nTo set values see - `" + command_data.server_config.prefix + "help leveling set`\nTo add values see - `" + command_data.server_config.prefix + "help leveling add`\nTo remove values see - `" + command_data.server_config.prefix + "help leveling remove`",
                    color: 8388736,
                    fields: [
                        {
                            name: "Status:",
                            value: "`" + command_data.server_config.module_level_enabled + "`"
                        },
                        {
                            name: "Level-up messages:",
                            value: "`" + command_data.server_config.module_level_levelupMessages + "`" + " (Channel: " + channel0 + ")"
                        },
                        {
                            name: "Level-up format:",
                            value: "`" + command_data.server_config.module_level_levelupMessages_format + "`" + " (Mention: `" + command_data.server_config.module_level_levelupMessages_ping + "`)"
                        },
                        {
                            name: "Level-up settings:",
                            value: "Message XP: `" + command_data.server_config.module_level_message_exp + "` (Level XP: `" + command_data.server_config.module_level_level_exp + "`, Multiplier `" + command_data.server_config.module_level_level_multiplier + "x`)"
                        },
                        {
                            name: "Ignored channels:",
                            value: ignoredChannelsText
                        }
                    ]
                }

                //Send message
                command_data.msg.channel.send("", { embed: embedLevel }).catch(e => { console.log(e); });
        } else {
                //Get action
                var action = command_data.args[0];

                switch(action) {
                        case "view": {
                            //Argument check
                            if(command_data.args.length < 2) {
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to view- (Check `" + command_data.server_config.prefix + "help leveling view` for help)", "view ranks") }).catch(e => { console.log(e); });
                                return;
                            }
                            const property = command_data.args[1];

                            switch(property) {
                                case "ranks": {
                                    //Construct serverMute
                                    var ranks = command_data.server_config.module_level_ranks;
                                    const embedRanks = new data.bot.Discord.MessageEmbed()
                                    .setColor(8388736)
                                    .setTitle('❯ Ranks (' + ranks.length + ')');

                                    for(let i = 0; i < ranks.length; i++) {
                                        let rank = ranks[i];
                                        var role = await command_data.msg.guild.roles.fetch(rank.roleID).catch(e => { console.log(e); });
                                        if(role === undefined) {
                                            command_data.msg.reply(`There was an error in fetching Role-`);
                                            return;
                                        }

                                        embedRanks.addField("Rank#" + rank.name + " - " + rank.level, "Role - `" + role.name + "`");
                                    }

                                    command_data.msg.channel.send("", { embed: embedRanks }).catch(e => { console.log(e); });
                                    break;
                                }

                                default:
                                    data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `view`- (Check `" + command_data.server_config.prefix + "help leveling view` for help)", "view ranks") }).catch(e => { console.log(e); });
                                    break;
                            }
                            break;
                        }

                        case "add": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to add a `value` to- (Check `" + command_data.server_config.prefix + "help leveling add` for help)", "add ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                        return;
                                }
                                const property = command_data.args[1];

                                switch(property) {
                                        case "rank":
                                                //Permission check
                                                if(command_data.msg.guild.me.hasPermission("MANAGE_ROLES") === false) {
                                                        var channel = await command_data.msg.guild.channels.fetch(command_data.server_config.module_level_levelup_channelID).catch(e => { console.log(e); });;
                                                        channel.send("The bot doesn't have required permissions to do this - `Manage Roles`\nPlease add required permissions and try again-").catch(e => { console.log(e); });
                                                        return;
                                                }

                                                //Argument check
                                                if(command_data.args.length < 3) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `rankName`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                var rankName = command_data.args[2];
                                                var doesExist = false;
                                                command_data.server_config.module_level_ranks.forEach(function(rank) {
                                                        if(rank.name === rankName) {
                                                                doesExist = true;
                                                        }
                                                });
                                                if(doesExist === true) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Rank with name `" + rankName + "` already exists", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                if(command_data.args.length < 4) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `levelRequirement`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                var levelRequirement = parseInt(command_data.args[3]);
                                                if(isNaN(levelRequirement) || levelRequirement <= 0) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value for `levelRequirement` (number)", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                if(command_data.args.length < 5) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `roleName`", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                var roleName = data.msg.content.substring(data.msg.content.indexOf(command_data.args[4], data.msg.content.indexOf(command_data.args[3]) + command_data.args[3].length));
                                                var role = command_data.msg.guild.roles.cache.find(roleTemp =>
                                                        roleTemp.name === roleName
                                                );
                                                if(role === undefined) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "No role with name `" + roleName + "` found", "add rank Trusted 5 TrustedRole") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_ranks.push({ id: data.bot.crypto.randomBytes(16).toString("hex"), serverID: command_data.msg.guild.id, name: rankName, level: levelRequirement, roleID: role.id });
                                                command_data.msg.channel.send("Added rank `" + rankName + "` for level `" + levelRequirement + "` with role `" + roleName + "`-").catch(e => { console.log(e); });
                                                break;

                                        case "ignoredChannel":
                                                //Argument check
                                                if(command_data.args.length < 3) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `channelMention` (channel mention)", "add ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                var channel = command_data.args[2];
                                                channel = channel.includes("<#") ? channel.replace("<#", "").replace(">", "") : channel;

                                                if(command_data.msg.guild.channels.cache.has(channel) === false) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value for `channelMention` (channel mention)", "add ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                var i = 0;
                                                var channelIndex = -1;
                                                command_data.server_config.module_level_ignoredChannels.forEach(function(channel) {
                                                        if(channel.id === channel) {
                                                                channelIndex = i;
                                                        }

                                                        i += 1;
                                                });

                                                if(channelIndex > 0) {
                                                        command_data.msg.channel.send("Channel " + command_data.args[2] + " is already ignored-").catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_ignoredChannels.push(channel);
                                                command_data.msg.channel.send("Added " + channel + " to ignored channels-").catch(e => { console.log(e); });
                                                break;

                                        default:
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `add`- (Check `" + command_data.server_config.prefix + "help leveling add` for help)", "add ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                                break;
                        }

                        case "remove": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to remove a `value` from- (Check `" + command_data.server_config.prefix + "help leveling remove` for help)", "remove " + property + " <value>") }).catch(e => { console.log(e); });
                                        return;
                                }
                                const property = command_data.args[1];

                                switch(property) {
                                        case "rank": {
                                                //Argument check
                                                if(command_data.args.length < 3) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `rankName`-", "remove rank Trusted") }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                const rankName = command_data.args[2];
                                                let rankID = -1;
                                                command_data.server_config.module_level_ranks.forEach(function(rank) {
                                                        if(rank.name === rankName) {
                                                                rankID = rank.id;
                                                        }
                                                });

                                                if(rankID === -1) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "No rank with name `" + rankName + "` found", "remove rank Trusted") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.global_context.neko_modules_clients.ssm.server_remove.removeRank(command_data.global_context.neko_modules_clients.ssm, rankID);
                                                command_data.msg.channel.send("Removed rank `" + rankName + "`-");
                                                break;
                                        }

                                        case "ignoredChannel": {
                                                //Argument check
                                                if(command_data.args.length < 3) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `channelMention` (channel mention)", "remove ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                        return;
                                                }
                                                let channel = command_data.args[2];
                                                channel = channel.includes("<#") ? channel.replace("<#", "").replace(">", "") : channel;

                                                if(command_data.msg.guild.channels.cache.has(channel) === false) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value for `channelMention` (channel mention)", "remove ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                let i = 0;
                                                let channelIndex = -1;
                                                command_data.server_config.module_level_ignoredChannels.forEach(function(channel) {
                                                        if(channel.id === channel) {
                                                                channelIndex = i;
                                                        }

                                                        i += 1;
                                                });

                                                if(channelIndex < 0) {
                                                        command_data.msg.channel.send("Channel " + command_data.args[2] + " is not ignored-").catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_ignoredChannels.splice(channelIndex, 1);
                                                command_data.msg.channel.send("Removed " + channel + " from ignored channels-").catch(e => { console.log(e); });
                                                break;
                                        }

                                        default:
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `remove`- (Check `" + command_data.server_config.prefix + "help leveling remove` for help)", "remove ignoredChannel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });

                                console.log("[module_level] Removed value from bot's property `" + property + "` on Server(id: " + command_data.msg.guild.id + ")");
                                break;
                        }

                        case "set": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a `property` to set `value` to- (Check `" + command_data.server_config.prefix + "help leveling set` for help)", "set enabled true") }).catch(e => { console.log(e); });
                                        return;
                                }
                                const property = command_data.args[1];

                                if(command_data.args.length < 3) {
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "You need to enter a new value for `" + property + "`-", "set " + property + " <newValue>") }).catch(e => { console.log(e); });
                                        return;
                                }
                                let value = command_data.args[2];
                                const valueText = data.msg.content.substring(data.msg.content.indexOf(value));

                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                        case "enabled":
                                                var bool = value === 'true' ? true : (value === 'false' ? false : value);

                                                if(typeof bool !== "boolean") {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_enabled = bool;
                                                break;

                                        case "levelupMessages":
                                                var bool2 = value === 'true' ? true : (value === 'false' ? false : value);

                                                if(typeof bool2 !== "boolean") {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_levelupMessages = bool2;
                                                break;

                                        case "levelupMessages_format":
                                                if(typeof value !== "string" || value.length < 1) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (text)", "set " + property + " <user> just got level <level>!") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_levelupMessages_format = valueText;
                                                value = valueText;
                                                break;

                                        case "levelupMessages_channel": {
                                                const value2 = value.includes("<#") ? value.replace("<#", "").replace(">", "") : value;

                                                if(command_data.msg.guild.channels.cache.has(value2) === false) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value for `channelMention` (channel mention)", "set levelupMessages_channel #" + data.msg.channel.name) }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                var channel = await command_data.msg.guild.channels.fetch(value2).catch(e => { console.log(e); });;
                                                if(channel
                                                .permissionsFor(data.bot.user)
                                                .has("VIEW_CHANNEL") === false ||
                                                channel
                                                .permissionsFor(data.bot.user)
                                                .has("SEND_MESSAGES") === false) {
                                                        command_data.msg.reply("The bot doesn't have required permissions in this channel - `View Channel`, `Send Messages`\nPlease add required permissions for the bot in this channel and try again-");
                                                        return;
                                                }

                                                command_data.server_config.module_level_levelupMessages_channel = value2;
                                                break;
                                        }

                                        case "levelupMessages_ping":
                                                var bool3 = value === 'true' ? true : (value === 'false' ? false : value);

                                                if(typeof bool3 !== "boolean") {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_levelupMessages_ping = bool3;
                                                break;

                                        case "message_exp":
                                                if(isNaN(value) || parseFloat(value) <= 0) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (number)", "set " + property + " 2") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_message_exp = value;
                                                break;

                                        case "level_exp":
                                                if(isNaN(value) || parseFloat(value) <= 0) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (number)", "set " + property + " 200") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_level_exp = value;
                                                break;

                                        case "level_multiplier":
                                                if(isNaN(value) || parseFloat(value) <= 0) {
                                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (number)", "set " + property + " 1.3") }).catch(e => { console.log(e); });
                                                        return;
                                                }

                                                command_data.server_config.module_level_level_multiplier = value;
                                                break;

                                        default:
                                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `set`- (Check `" + command_data.server_config.prefix + "help leveling set` for help)", "set enabled true") }).catch(e => { console.log(e); });
                                                return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                                command_data.msg.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                                break;
                        }

                        default:
                                data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `view`,`add`,`set`,`remove`)", "set enabled true") }).catch(e => { console.log(e); });
                                break;
                }
        }
    },
};