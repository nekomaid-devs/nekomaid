const NeededPermission = require("../scripts/helpers/needed_permission");

module.exports = {
    name: "moderation",
    category: "Modules",
    description: "Changes moderation settings of the server.",
    helpUsage: "[action?] [property?] [value?]` *(arguments depend on action)*",
    exampleUsage: "set invites false",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map()
    .set("add",
    "`<subcommand_prefix> banned_word [word]` - Adds a banned word")
    .set("remove",
    "`<subcommand_prefix> banned_word [word]` - Removes a banned word")
    .set("set",
    "`<subcommand_prefix> invites [true/false]` - Enables/Disables posting Discord server invites"),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [
         new NeededPermission("author", "MANAGE_GUILD")
    ],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        // TODO: make normal reply messages
        // TODO: check for wrong error embeds
        if(command_data.args.length < 1) {
            let banned_words = command_data.server_config.banned_words.reduce((acc, curr) => { acc += "`" + curr + "`, "; return acc; }, "");
            banned_words = banned_words.slice(0, banned_words.length - 2);
            if(banned_words === "") {
                banned_words = "`None`";
            }

            let embedConfig = {
                title: "Moderation",
                description: `To add values see - \`${command_data.server_config.prefix}help moderation add\`\nTo remove values see - \`${command_data.server_config.prefix}help moderation remove\`\nTo set values see - \`${command_data.server_config.prefix}help moderation set\``,
                color: 8388736,
                fields: [
                    {
                        name: "Banned Words:",
                        value: banned_words
                    },
                    {
                        name: "Invites:",
                        value: `${command_data.server_config.invites == true ? "Allowed" : "Banned"}`
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
                    command_data.msg.reply(`You need to enter a \`property\` to add a \`value\` to- (Check \`${command_data.server_config.prefix}help moderation add\` for help)`);
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.reply(`You need to enter a value to add to \`${property}\`-`);
                    return;
                }
                let args_temp = command_data.args.slice(2);
                let value = args_temp.join(" ");
    
                switch(property) {
                    case "banned_word": {
                        if(command_data.server_config.banned_words.includes(value) === true) {
                            command_data.msg.reply(`Word \`${value}\` is already banned.`);
                            return;
                        }

                        command_data.server_config.banned_words.push(value);
                        command_data.msg.channel.send(`Added \`${value}\` to banned words.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }
    
                    default: {
                        command_data.msg.reply(`Invalid property for \`add\`- (Check \`${command_data.server_config.prefix}help moderation add\` for help)`);
                        return;
                    }
                }
    
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }
    
            case "remove": {
                if(command_data.args.length < 2) {
                    command_data.msg.reply(`You need to enter a \`property\` to remove a \`value\` from- (Check \`${command_data.server_config.prefix}help moderation remove\` for help)`);
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.reply(`You need to enter a value to remove from \`${property}\`-`);
                    return;
                }
                let args_temp = command_data.args.slice(2);
                let value = args_temp.join(" ");
    
                switch(property) {
                    case "banned_word": {
                        if(command_data.server_config.banned_words.includes(value) === false) {
                            command_data.msg.reply(`Word \`${value}\` isn't a banned.`);
                            return;
                        }

                        command_data.server_config.banned_words.splice(command_data.server_config.banned_words.indexOf(command_data.args[2]), 1);
                        command_data.msg.channel.send(`Removed \`${value}\` from banned words.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        // TODO: check for these fake ones
                        command_data.msg.reply(`Invalid property for \`remove\`- (Check \`${command_data.server_config.prefix}help moderation remove\` for help)`);
                        return;
                    }
                }
    
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }

            case "set": {
                if(command_data.args.length < 2) {
                    command_data.msg.reply(`You need to enter a \`property\` to set a \`value\` to- (Check \`${command_data.server_config.prefix}help moderation set\` for help)`);
                    return;
                }
                let property = command_data.args[1];

                if(command_data.args.length < 3) {
                    command_data.msg.reply(`You need to enter a value to set to \`${property}\`-`);
                    return;
                }
                let value = command_data.args[2];
                let value_text = command_data.msg.content.substring(command_data.msg.content.indexOf(value));

                switch(property) {
                    case "invites": {
                        let bool = value === 'true' ? true : (value === 'false' ? false : value);
                        if(typeof bool !== "boolean") {
                            command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid value to set for `" + property + "`- (true/false)", "set " + property + " true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                            return;
                        }

                        command_data.server_config.invites = bool;
                        command_data.msg.channel.send(`${bool ? "Allowed" : "Banned"} invites in messages.`).catch(e => { command_data.global_context.logger.api_error(e); });
                        break;
                    }

                    default: {
                        command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, `Invalid property for \`set\`- (Check \`${command_data.server_config.prefix}help moderation set\` for help)`, "set invites true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                        return;
                    }
                }

                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "server", id: command_data.msg.guild.id, server: command_data.server_config });
                break;
            }
    
            default: {
                command_data.msg.channel.send("", { embed: command_data.global_context.neko_modules.vars.get_error_embed(command_data.msg, command_data.server_config.prefix, this, "Invalid action- (Actions: `add`, `set`, `remove`)", "set invites true") }).catch(e => { command_data.global_context.logger.api_error(e); });
                break;
            }
        }
    },
};