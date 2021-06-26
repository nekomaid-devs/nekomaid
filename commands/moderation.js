const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "moderation",
    category: "Modules",
    description: "Changes moderation settings of the server-",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set invites false",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> bannedWord [word]` - Adds a banned word")
    .set("remove",
    "`<subcommand_prefix> bannedWord [word]` - Removes a banned word")
    .set("set",
    "`<subcommand_prefix> invites [true/false]` - Enables/Disables posting Discord server invites"),
    argumentsNeeded: [],
    permissionsNeeded: [
         new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.args.length < 1) {
                var bannedWords = "";
                command_data.server_config.bannedWords.forEach(function(userID, index) {
                    bannedWords += "`" + userID + "`";

                    if(command_data.server_config.bannedWords.length - 1 > index) {
                        bannedWords += ", ";
                    }
                });

                if(bannedWords === "") {
                    bannedWords = "`None`";
                }

                //Contruct embed
                let embedConfig = {
                    title: "Moderation",
                    description: "To add values see - `" + command_data.server_config.prefix + "help moderation add`\nTo remove values see - `" + command_data.server_config.prefix + "help moderation remove`\nTo set values see - `" + command_data.server_config.prefix + "help moderation set`",
                    color: 8388736,
                    fields: [
                            {
                                name: "Banned Words:",
                                value: bannedWords
                            },
                            {
                                name: "Invites:",
                                value: "`" + command_data.server_config.invites + "`"
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
                                    data.msg.reply("You need to enter a `property` to add a `value` to- (Check `" + command_data.server_config.prefix + "help moderation add` for help)");
                                    return;
                                }
                                const property = command_data.args[1];

                                if(command_data.args.length < 3) {
                                    command_data.msg.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                const args2 = command_data.args.slice(2)
                                const value = args2.join(" ")
        
                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "bannedWord":
                                        command_data.server_config.bannedWords.push(value);
                                        break;
        
                                    default:
                                        command_data.msg.reply("Invalid property for `add`- (Check `" + command_data.server_config.prefix + "help moderation add` for help)");
                                        return;
                                }
        
                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
        
                                console.log("[moderation] Added " + value + " to bot's property " + property);
                                command_data.msg.channel.send("Added `" + value + "` to bot's property `" + property + "`").catch(e => { console.log(e); });
                                break;
                        }
        
                        case "remove": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                    command_data.msg.reply("You need to enter a `property` to remove a `value` from-");
                                    return;
                                }
                                const property = command_data.args[1];

                                if(command_data.args.length < 3) {
                                    command_data.msg.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                const args2 = command_data.args.slice(2)
                                const value = args2.join(" ")
        
                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "bannedWord":
                                        if(command_data.server_config.bannedWords.includes(value) === false) {
                                            command_data.msg.reply("Word `" + value + "` isn't a banned-");
                                            return;
                                        }

                                        command_data.server_config.bannedWords.splice(command_data.server_config.bannedWords.indexOf(command_data.args[2]), 1);
                                        break;
    
                                    default:
                                        command_data.msg.reply("Invalid property for `remove`- (Check `" + command_data.server_config.prefix + "help moderation remove` for help)");
                                        return;
                                }
        
                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
        
                                console.log("[moderation] Removed " + value + " from bot's property " + property);
                                command_data.msg.channel.send("Removed `" + value + "` from bot's property `" + property + "`").catch(e => { console.log(e); });
                                break;
                        }

                        case "set": {
                                //Argument check
                                if(command_data.args.length < 2) {
                                    command_data.msg.reply("You need to enter a `property` to set `value` to- (Check `" + command_data.server_config.prefix + "help moderation set` for help)");
                                    return;
                                }
                                var property = command_data.args[1];

                                if(command_data.args.length < 3) {
                                    command_data.msg.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                var value = command_data.args[2];

                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "invites":
                                        var bool0 = value === 'true' ? true : (value === 'false' ? false : value);

                                        if(typeof bool0 !== "boolean") {
                                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                            return;
                                        }

                                        command_data.server_config.invites = bool0;
                                        break;

                                    default:
                                        data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid property for `set`- (Check `" + command_data.server_config.prefix + "help moderation set` for help)", "set invites true") }).catch(e => { console.log(e); });
                                        return;
                                }

                                //Save edited config
                                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                                command_data.msg.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                                break;
                        }
        
                        default:
                            data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.getErrorEmbed(data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`,`set`,`remove`)", "set invites true") }).catch(e => { console.log(e); });
                            break;
                }
        }
    },
};