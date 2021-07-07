const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "help",
    category: "Help & Information",
    description: "Displays all available commands.",
    helpUsage: "[command?] [subcommand?]` *(both arguments optional)*",
    exampleUsage: "config set",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a command.", "none"),
        new RecommendedArgument(2, "Argument needs to be a subcommand.", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let show_hidden = false;
        if(command_data.args.includes("-h")) {
            if(command_data.global_context.bot_config.bot_owners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply("You aren't the bot owner-");
                return;
            }

            show_hidden = true;
            command_data.args.splice(command_data.args.indexOf("-h"), 1);
        }

        if(command_data.args.length > 0) {
            let command_keys = Array.from(command_data.global_context.commands.keys());
            var target_command_name = command_data.args[0];
            if(command_data.global_context.command_aliases.has(target_command_name) === true) {
                target_command_name = command_data.global_context.command_aliases.get(target_command_name);
            }

            if(command_keys.includes(target_command_name) === false || (command_data.global_context.commands.get(target_command_name).hidden === true && show_hidden === false)) {
                command_data.msg.channel.send(`Command \`${target_command_name}\` not found - see \`${command_data.server_config.prefix}help\` for help`).catch(e => { command_data.global_context.logger.api_error(e); });
                return;
            }

            var command = command_data.global_context.commands.get(target_command_name);
            if(command_data.args.length > 1) {
                var target_subcommand_name = command_data.args[1];
                if(command.subcommandHelp.has(target_subcommand_name) === false) {
                    command_data.msg.channel.send(`Subcommand \`${target_subcommand_name}\` not found - see \`${command_data.server_config.prefix}help\` for help`).catch(e => { command_data.global_context.logger.api_error(e); });
                    return;
                }

                var unhidden_text = show_hidden === true && command.hidden === true ? "❓" : "";
                var commands_text = command.name + " " + target_subcommand_name;
                var usage = command.subcommandHelp.get(target_subcommand_name);
                usage = usage.split("<subcommand_prefix>").join(command_data.server_config.prefix + commands_text);

                let embedHelp = new command_data.global_context.modules.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle(`Help for - \`${unhidden_text + commands_text}\``);
                embedHelp.addField("Usage:", usage);

                command_data.msg.channel.send("", { embed: embedHelp }).catch(e => { command_data.global_context.logger.api_error(e); });
            } else {
                let unhidden_text = show_hidden === true && command.hidden === true ? "❓" : "";
                let commands_text = command.name;
                let usage = command.helpUsage;
                command.aliases.forEach((alias) => {
                    commands_text += "/" + alias;
                });

                let embedHelp = new command_data.global_context.modules.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle(`Help for - \`${unhidden_text + commands_text}\``)
                .setDescription(command.description);
                embedHelp.addField("Usage:", "`" + command_data.server_config.prefix + commands_text + " " + usage);

                if(command.subcommandHelp.size > 0) {
                    let commands_text_2 = "";
                    command.subcommandHelp.forEach((usage, subcommand) => {
                        commands_text_2 += `Check \`${command_data.server_config.prefix}help ${command.name} ${subcommand}\` for help\n`;
                    });

                    embedHelp.addField("Subcommands:", commands_text_2);
                }

                command_data.msg.channel.send("", { embed: embedHelp }).catch(e => { command_data.global_context.logger.api_error(e); });
            }
        } else {
            let commands = Array.from(command_data.global_context.commands.values());
            let categories = new Map([
                ['Help & Information', { prefix: "<:n_help:771821666895527986> ", items: [], nsfw: false }],
                ['Actions', { prefix: "<:n_actions:771821287105363969> ", items: [], nsfw: false }],
                ['Emotes', { prefix: "<:n_emotes:771822090395189258> ", items: [], nsfw: false }],
                ['Fun', { prefix: "<:n_fun:771823135816941608> ", items: [], nsfw: false }],
                ['Profile', { prefix: "<:n_profile:771824245688762379> ", items: [], nsfw: false }],
                ['NSFW', { prefix: "<:n_nsfw:771822354497273877> ", items: [], nsfw: true }],
                ['Utility', { prefix: "<:n_utility:771824485413945355> ", items: [], nsfw: false }],
                ['Music', { prefix: "<:n_music:771823629570277396> ", items: [], nsfw: false }],
                ['Moderation', { prefix: "<:n_moderation:771822603153047592> ", items: [], nsfw: false }],
                ['Modules', { prefix: "<:n_modules:771824772652204032> ", items: [], nsfw: false }],
                ['Leveling', { prefix: "<:n_leveling:771822966181724170> ", items: [], nsfw: false }],
                ['Testing', { prefix: "", items: [], nsfw: false }]
            ]);
            commands
            .filter(e => { return (show_hidden === true || e.hidden === false) && categories.has(e.category); })
            .forEach(command => {
                categories.get(command.category).items.push(command);
            });

            let url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
            let unhidden_text = show_hidden === true ? " (Unhidden)" : "";
            let embedHelp = new command_data.global_context.modules.Discord.MessageEmbed()
            .setColor(8388736)
            .setTitle(`❯     Prefix: \`${command_data.server_config.prefix}\` - Help ${unhidden_text}`)
            .setDescription(`For help with a command, use \`${command_data.server_config.prefix}help [command] [subcommand?]\`.\nMake sure to join the server as there'll be cool stuff in the future!~ Have fun!~ \nAvailable commands, by category:`)
            .setFooter(`NekoMaid ${command_data.global_context.config.version}`, `${url}`);
            
            let categories_keys = Array.from(categories.keys());
            categories_keys.forEach(category_key => {
                let category = categories.get(category_key);
                let commands_string = "";
                let commands_keys = category.items;
    
                commands_keys.sort((a,b) => { return a.name.localeCompare(b.name); });
                commands_keys.forEach((command, index) => {
                    let command_text = show_hidden === true && command.hidden === true ? "❓" + command.name : command.name;
                    command.aliases.forEach((alias) => {
                        command_text += "/" + alias;
                    });

                    commands_string += `\`${command_text}\``;
                    if(commands_keys.length - 1 > index) {
                        commands_string += ", ";
                    }
                });

                if(commands_string != "") {
                    embedHelp.addField(category.prefix + category_key, category.nsfw && command_data.msg.channel.nsfw === false ? "Hidden in SFW channel, try changing this channel to NSFW" : commands_string);
                }
            });

            command_data.msg.channel.send("", { embed: embedHelp }).catch(e => { command_data.global_context.logger.api_error(e); });
        }
    },
};