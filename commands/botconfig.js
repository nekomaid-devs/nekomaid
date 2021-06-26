const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "botconfig",
    category: "Help & Information",
    description: "Changes settings of the bot-",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "add BotOwner /userTag/",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> botOwner [mention]` - Add a bot owner")
    .set("remove",
    "`<subcommand_prefix> botOwner [mention]` - Removes a bot owner"),
    argumentsNeeded: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        if(command_data.args.length < 1) {
            var botOwnersText = "";

            command_data.global_context.bot_config.botOwners.forEach(function(userID, index) {
                var botOwner = data.bot.users.resolve(userID);

                if(botOwner === undefined) {
                    botOwnersText += "`" + userID + "`";
                } else {
                    botOwnersText += "`" + botOwner.username + "#" + botOwner.discriminator + "`";
                }

                if(command_data.global_context.bot_config.botOwners.length - 1 > index) {
                    botOwnersText += ", ";
                }
            });

            //Contruct embed
            let embedConfig = {
                title: "Bot Config",
                color: 8388736,
                fields: [
                    {
                        name: "Bot Owners:",
                        value: botOwnersText
                    }
                ]
            }

            //Send message
            command_data.msg.channel.send("", { embed: embedConfig }).catch(e => { console.log(e); });
            return;
        }

        //Get action
        var action = command_data.args[0];

        switch(action) {
            case "add": {
                //Argument check
                if(command_data.args.length < 2) {
                    data.msg.reply("You need to enter a `property` to add a `value` to-");
                    return;
                }
                const property = command_data.args[1];
                
                let taggedUsers = [ data.msg.member.user ];
                if(data.msg.mentions.users.array().length > 0) {
                    taggedUsers = data.msg.mentions.users.array();
                } else {
                    data.msg.reply("You need to mention somebody to add/remove to/from `" + property + "`-");
                    return;
                }

                const taggedUser = taggedUsers[0];
                const taggedUserDisplayName = taggedUser.username + "#" + taggedUser.discriminator;

                //Edit property's value (and check if value is valid)
                switch(property) {
                    case "botOwner":
                        command_data.global_context.bot_config.botOwners.push(taggedUser.id);
                        break;

                    default:
                        data.msg.reply("Invalid property for `add`- (Check `" + command_data.server_config.prefix + "help botconfig add` for help)");
                        return;
                }

                //Save edited config
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(data.bot, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });

                console.log("[botconfig] Added " + taggedUserDisplayName + " to bot's property " + property);
                command_data.msg.channel.send("Added `" + taggedUserDisplayName + "` to bot's property `" + property + "`").catch(e => { console.log(e); });
                break;
            }

            case "remove": {
                //Argument check
                if(command_data.args.length < 2) {
                    data.msg.reply("You need to enter a `property` to remove a `value` from-");
                    return;
                }
                const property = command_data.args[1];

                let taggedUsers = [ data.msg.member.user ];
                if(data.msg.mentions.users.array().length > 0) {
                    taggedUsers = data.msg.mentions.users.array();
                } else {
                    data.msg.reply("You need to mention somebody to add to `" + property + "`-");
                    return;
                }

                const taggedUser = taggedUsers[0];
                const taggedUserDisplayName = taggedUser.username + "#" + taggedUser.discriminator;

                //Edit property's value (and check if value is valid)
                switch(property) {
                    case "botOwner":
                        if(command_data.global_context.bot_config.botOwners.includes(taggedUser.id) === false) {
                            data.msg.reply("`" + taggedUserDisplayName + "` isn't a bot owner-");
                            return;
                        }

                        if(taggedUser.id === "566751683963650048") {
                            data.msg.reply("no");
                            return;
                        }

                        command_data.global_context.bot_config.botOwners.splice(command_data.global_context.bot_config.botOwners.indexOf(taggedUser.id), 1);
                        break;

                    default:
                        data.msg.reply("Invalid property for `remove`- (Check `" + command_data.server_config.prefix + "help botconfig remove` for help)");
                        return;
                }

                //Save edited config
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(data.bot, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });

                console.log("[botconfig] Removed " + taggedUserDisplayName + " from bot's property " + property);
                command_data.msg.channel.send("Removed `" + taggedUserDisplayName + "` from bot's property `" + property + "`").catch(e => { console.log(e); });
                break;
            }

            default:
                data.msg.reply("Invalid action- (Actions: `add, remove`)");
                break;
        }
    },
};