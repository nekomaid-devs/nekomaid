module.exports = {
    name: 'help',
    category: 'Help & Information',
    description: 'Displays all available commands-',
    helpUsage: "[command?] [subcommand?]` *(both arguments optional)*",
    exampleUsage: "config set",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        var showHidden = false;

        //Permission check
        if(data.args.includes("-h")) {
            if(data.botConfig.botOwners.includes(data.authorUser.id) === false) {
                data.reply("You aren't the bot owner-");
                return;
            }

            showHidden = true;
            data.args.splice(data.args.indexOf("-h"), 1);
        }

        //Get categories
        if(data.args.length > 0) {
            var commandKeys = Array.from(data.bot.commands.keys());
            var targetCommandName = data.args[0];

            //Translate alias
            if(data.bot.aliases.has(targetCommandName) === true) {
                targetCommandName = data.bot.aliases.get(targetCommandName);
            }

            //Check if command exists
            if(commandKeys.includes(targetCommandName) === false || (data.bot.commands.get(targetCommandName).hidden === true && showHidden === false)) {
                data.channel.send("Command `" + targetCommandName + "` not found - see `" + data.serverConfig.prefix + "help` for help").catch(e => { console.log(e); });
                return;
            }

            //Get command
            var command = data.bot.commands.get(targetCommandName);

            //Check for subcommand
            if(data.args.length > 1) {
                var targetSubcommandName = data.args[1];

                //Check if subcommand exists
                if(command.subcommandHelp.has(targetSubcommandName) === false) {
                    data.channel.send("Subcommand `" + targetSubcommandName + "` not found - see `" + data.serverConfig.prefix + "help` for help").catch(e => { console.log(e); });
                    return;
                }

                //Construct text
                var unhiddenText = showHidden === true && command.hidden === true ? "❓" : "";
                var commandsText = command.name + " " + targetSubcommandName;
                var usage = command.subcommandHelp.get(targetSubcommandName);
                usage = usage.split("<subcommand_prefix>").join(data.serverConfig.prefix + commandsText);

                //Construct embed
                const embedHelp = new data.bot.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle('Help for - `' + unhiddenText + commandsText + '`');

                embedHelp.addField("Usage:", usage);

                //Send message
                data.channel.send("", { embed: embedHelp }).catch(e => { console.log(e); });
            } else {
                //Construct text
                var unhiddenText2 = showHidden === true && command.hidden === true ? "❓" : "";
                var commandsText2 = command.name;
                var usage2 = command.helpUsage;
                command.aliases.forEach(function(alias) {
                    commandsText2 += "/" + alias;
                })

                //Construct embed
                const embedHelp = new data.bot.Discord.MessageEmbed()
                .setColor(8388736)
                .setTitle('Help for - `' + unhiddenText2 + commandsText2 + '`')
                .setDescription(command.description);

                embedHelp.addField("Usage:", "`" + data.serverConfig.prefix + commandsText2 + " " + usage2);

                if(command.subcommandHelp.size > 0) {
                    var commandsString2b = "";

                    command.subcommandHelp.forEach(function(usage, subcommand) {
                        commandsString2b += 'Check `' + data.serverConfig.prefix + "help " + command.name + " " + subcommand + '` for help\n';
                    });

                    embedHelp.addField("Subcommands:", commandsString2b);
                }

                //Send message
                data.channel.send("", { embed: embedHelp }).catch(e => { console.log(e); });
            }
        } else {
            var commands = data.bot.commands.array();

            var categories = new Map([
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
    
            //Collect commands into categories
            commands.forEach(command => {
                if((showHidden === true || command.hidden === false) && categories.has(command.category)) {
                    categories.get(command.category).items.push(command);
                }
            });

            //Construct unhidden text
            var unhiddenText3 = showHidden === true ? " (Unhidden)" : "";
    
            //Construst embed
            const embedHelp = new data.bot.Discord.MessageEmbed()
            .setColor(8388736)
            .setTitle('❯     Prefix: `' + `${data.serverConfig.prefix}` + '` - Help' + unhiddenText3)
            .setDescription("For help with a command, use `" + data.serverConfig.prefix + "help [command] [subcommand?]`.\nMake sure to join the server as there'll be cool stuff in the future!~ Have fun!~ \nAvailable commands, by category:")
            .setFooter(`NekoMaid ${data.bot.ssm.version}`, `${data.botConfig.avatarUrl}`);
            
            //Collect commands from categories
            var categoriesKeys = Array.from(categories.keys());
    
            categoriesKeys.forEach(categoryKey => {
                var category = categories.get(categoryKey);
                var commandsString = "";
                var commandsKeys = category.items;
    
                commandsKeys.sort((a,b) => { return a.name.localeCompare(b.name); });
                commandsKeys.forEach(function(command, index) {
                    var commandsText = showHidden === true && command.hidden === true ? "❓" + command.name : command.name;
                    command.aliases.forEach(function(alias) {
                        commandsText += "/" + alias;
                    })

                    commandsString += '`' + commandsText + '`';
    
                    if(commandsKeys.length - 1 > index) {
                        commandsString += ", ";
                    }
                });

                if(commandsString != "") {
                    embedHelp.addField(category.prefix + categoryKey, category.nsfw && data.channel.nsfw === false ? "Hidden in SFW channel, try changing this channel to NSFW" : commandsString);
                }
            });
        
            //Send message
            data.channel.send("", { embed: embedHelp }).catch(e => { console.log(e); });
        }
    },
};