const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "botconfig",
    category: "Help & Information",
    description: "Changes settings of the bot.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "add bot_owner /user_tag/",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> bot_owner [mention]` - Add a bot owner")
    .set("set",
    "`<subcommand_prefix> speed [number]` - Changes the speed at which the differences are calculated")
    .set("remove",
    "`<subcommand_prefix> bot_owner [mention]` - Removes a bot owner"),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
        new NeededPermission("author", "BOT_OWNER")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        if(command_data.args.length < 1) {
            let bot_owners_text = "";
            for(let i = 0; i < command_data.global_context.bot_config.bot_owners.length; i++) {
                let owner_ID = command_data.global_context.bot_config.bot_owners[i];
                let owner = await command_data.global_context.bot.users.fetch(owner_ID).catch(e => { command_data.global_context.logger.api_error(e); });
                if(owner === undefined) {
                    bot_owners_text += "`" + owner_ID + "`";
                } else {
                    bot_owners_text += "`" + owner.tag + "`";
                }

                if(command_data.global_context.bot_config.bot_owners.length - 1 > i) {
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
                    },
                    {
                        name: "Speed:",
                        value: `\`${command_data.global_context.bot_config.speed}\``
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
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.server_config.prefix}help botconfig add\` for help)`, "add bot_owner @LamkasDev") }).catch(e => { command_data.global_context.logger.api_error(e); });
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
                    case "bot_owner": {
                        command_data.global_context.bot_config.bot_owners.push(tagged_user.id);
                        command_data.msg.channel.send(`Added \`${tagged_user.tag}\` as a bot owner.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help botconfig add\` for help)`, "add bot_owner @LamkasDev") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
                break;
            }

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
                    case "speed": {
                        if(isNaN(value) || parseFloat(value) <= 0) {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid value to set for \`${property}\`. (number)`, `set ${property} 2`) }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        value = parseFloat(value);
                        command_data.global_context.bot_config.speed = value;
                        command_data.msg.channel.send(`Set speed to \`${value.toFixed(2)}\`.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help botconfig set\` for help)`, "set speed 2") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
                break;
            }

            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help botconfig remove\` for help)`, "remove bot_owner @LamkasDev") }).catch(e => { command_data.global_context.logger.api_error(e); });
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
                    case "bot_owner": {
                        if(command_data.global_context.bot_config.bot_owners.includes(tagged_user.id) === false) {
                            command_data.msg.reply(`\`${tagged_user.tag}\` isn't a bot owner.`);
                            return;
                        }
                        if(tagged_user.id === command_data.global_context.config.owner_id) {
                            command_data.msg.reply("no");
                            return;
                        }

                        command_data.global_context.bot_config.bot_owners.splice(command_data.global_context.bot_config.bot_owners.indexOf(tagged_user.id), 1);
                        command_data.msg.channel.send(`Removed \`${tagged_user.tag}\` from bot owners.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help botconfig remove\` for help)`, "remove bot_owner @LamkasDev") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "config", id: "defaultConfig", config: command_data.global_context.bot_config });
                break;
            }

            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "add bot_owner @LamkasDev") }).catch(e => { command_data.global_context.logger.api_error(e); });
                break;
            }
        }
    },
};