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
    async execute(command_data) {
        // TODO: normalize names of settings
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        if(command_data.args.length < 1) {
            let bot_owners_text = "";
            for(let i = 0; i < command_data.global_context.bot_config.botOwners.length; i++) {
                let owner_ID = command_data.global_context.bot_config.botOwners[i];
                let owner = await command_data.global_context.bot.users.fetch(owner_ID).catch(e => { console.log(e); });
                if(owner === undefined) {
                    bot_owners_text += "`" + owner_ID + "`";
                } else {
                    bot_owners_text += "`" + owner.tag + "`";
                }

                if(command_data.global_context.bot_config.botOwners.length - 1 > i) {
                    bot_owners_text += ", ";
                }
            }

            let embedConfig = {
                title: "Bot Config",
                color: 8388736,
                fields: [
                    {
                        name: "Bot Owners:",
                        value: bot_owners_text
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
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.server_config.prefix}help botconfig add\` for help)`, "add botOwner @LamkasDev") }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];
                
                let tagged_users = [ command_data.msg.member.user ];
                if(command_data.msg.mentions.users.array().length > 0) {
                    tagged_users = command_data.msg.mentions.users.array();
                } else {
                    command_data.msg.reply(`You need to mention somebody to add to \`${property}\`-`);
                    return;
                }
                let tagged_user = tagged_users[0];

                switch(property) {
                    // TODO: re-do this
                    case "botOwner": {
                        command_data.global_context.bot_config.botOwners.push(tagged_user.id);
                        command_data.msg.channel.send("Added `" + tagged_user.tag + "` to bot's property `" + property + "`").catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help botconfig add\` for help)`, "add botOwner @LamkasDev") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
                break;
            }

            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help botconfig remove\` for help)`, "remove botOwner @LamkasDev") }).catch(e => { console.log(e); });
                    return;
                }
                let property = command_data.args[1];

                let tagged_users = [ command_data.msg.member.user ];
                if(command_data.msg.mentions.users.array().length > 0) {
                    tagged_users = command_data.msg.mentions.users.array();
                } else {
                    command_data.msg.reply(`You need to mention somebody to remove from \`${property}\`-`);
                    return;
                }
                let tagged_user = tagged_users[0];

                switch(property) {
                    // TODO: re-do this
                    case "botOwner": {
                        if(command_data.global_context.bot_config.botOwners.includes(tagged_user.id) === false) {
                            command_data.msg.reply(`\`${tagged_user.tag}\` isn't a bot owner-`);
                            return;
                        }
                        if(tagged_user.id === command_data.global_context.owner_id) {
                            command_data.msg.reply("no");
                            return;
                        }

                        command_data.global_context.bot_config.botOwners.splice(command_data.global_context.bot_config.botOwners.indexOf(tagged_user.id), 1);
                        command_data.msg.channel.send("Removed `" + tagged_user.tag + "` from bot's property `" + property + "`").catch(e => { console.log(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help botconfig remove\` for help)`, "remove botOwner @LamkasDev") }).catch(e => { console.log(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`, `remove`)", "add botOwner @LamkasDev") }).catch(e => { console.log(e); });
                break;
            }
        }
    },
};