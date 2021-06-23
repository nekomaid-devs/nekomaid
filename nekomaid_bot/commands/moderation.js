const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: 'moderation',
    category: 'Modules',
    description: 'Changes moderation settings of the server-',
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
    execute(data) {
        if(data.args.length < 1) {
                var bannedWords = "";
                data.serverConfig.bannedWords.forEach(function(userID, index) {
                    bannedWords += "`" + userID + "`";

                    if(data.serverConfig.bannedWords.length - 1 > index) {
                        bannedWords += ", ";
                    }
                });

                if(bannedWords === "") {
                    bannedWords = "`None`";
                }

                //Contruct embed
                var embedConfig = {
                    title: `Moderation`,
                    description: "To add values see - `" + data.serverConfig.prefix + "help moderation add`\nTo remove values see - `" + data.serverConfig.prefix + "help moderation remove`\nTo set values see - `" + data.serverConfig.prefix + "help moderation set`",
                    color: 8388736,
                    fields: [
                            {
                                name: "Banned Words:",
                                value: bannedWords
                            },
                            {
                                name: "Invites:",
                                value: "`" + data.serverConfig.invites + "`"
                            }
                    ]
                }

                //Send message
                data.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
        } else {
                //Get action
                var action = data.args[0];

                switch(action) {
                        case "add": {
                                //Argument check
                                if(data.args.length < 2) {
                                    data.msg.reply("You need to enter a `property` to add a `value` to- (Check `" + data.serverConfig.prefix + "help moderation add` for help)");
                                    return;
                                }
                                const property = data.args[1];

                                if(data.args.length < 3) {
                                    data.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                const args2 = data.args.slice(2)
                                const value = args2.join(" ")
        
                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "bannedWord":
                                        data.serverConfig.bannedWords.push(value);
                                        break;
        
                                    default:
                                        data.reply("Invalid property for `add`- (Check `" + data.serverConfig.prefix + "help moderation add` for help)");
                                        return;
                                }
        
                                //Save edited config
                                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });
        
                                console.log("[moderation] Added " + value + " to bot's property " + property);
                                data.channel.send("Added `" + value + "` to bot's property `" + property + "`").catch(e => { console.log(e); });
                                break;
                        }
        
                        case "remove": {
                                //Argument check
                                if(data.args.length < 2) {
                                    data.reply("You need to enter a `property` to remove a `value` from-");
                                    return;
                                }
                                const property = data.args[1];

                                if(data.args.length < 3) {
                                    data.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                const args2 = data.args.slice(2)
                                const value = args2.join(" ")
        
                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "bannedWord":
                                        if(data.serverConfig.bannedWords.includes(value) === false) {
                                            data.reply("Word `" + value + "` isn't a banned-");
                                            return;
                                        }

                                        data.serverConfig.bannedWords.splice(data.serverConfig.bannedWords.indexOf(data.args[2]), 1);
                                        break;
    
                                    default:
                                        data.reply("Invalid property for `remove`- (Check `" + data.serverConfig.prefix + "help moderation remove` for help)");
                                        return;
                                }
        
                                //Save edited config
                                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });
        
                                console.log("[moderation] Removed " + value + " from bot's property " + property);
                                data.channel.send("Removed `" + value + "` from bot's property `" + property + "`").catch(e => { console.log(e); });
                                break;
                        }

                        case "set": {
                                //Argument check
                                if(data.args.length < 2) {
                                    data.reply("You need to enter a `property` to set `value` to- (Check `" + data.serverConfig.prefix + "help moderation set` for help)");
                                    return;
                                }
                                var property = data.args[1];

                                if(data.args.length < 3) {
                                    data.reply("You need to enter a new value for `" + property + "`-");
                                    return;
                                }
                                var value = data.args[2];

                                //Edit property's value (and check if value is valid)
                                switch(property) {
                                    case "invites":
                                        var bool0 = value === 'true' ? true : (value === 'false' ? false : value);

                                        if(typeof bool0 !== "boolean") {
                                            data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { console.log(e); });
                                            return;
                                        }

                                        data.serverConfig.invites = bool0;
                                        break;

                                    default:
                                        data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid property for `set`- (Check `" + data.serverConfig.prefix + "help moderation set` for help)", "set invites true") }).catch(e => { console.log(e); });
                                        return;
                                }

                                //Save edited config
                                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "server", id: data.guild.id, server: data.serverConfig });
                                data.channel.send("Set bot's property `" + property + "` to `" + value + "`").catch(e => { console.log(e); });
                                break;
                        }
        
                        default:
                            data.msg.channel.send("", { embed: data.bot.vars.getErrorEmbed(data.msg, data.serverConfig.prefix, this, "Invalid action- (Actions: `add`,`set`,`remove`)", "set invites true") }).catch(e => { console.log(e); });
                            break;
                }
        }
    },
};