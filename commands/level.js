module.exports = {
    name: "level",
    category: "Leveling",
    description: "Displays the tagged user's server profile-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["lvl"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        //Argument check
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply("Leveling isn't enabled on this server- (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }

        //Construct embed
        var avatarUrl = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });

        //Update top users
        var top = await data.bot.sb.updateTopServerLevel(data.bot, command_data.server_config, command_data.msg.guild);

        //Get what position target user is
        var authorPos = -1;
        var authorConfig = -1;
        for(var i = 0; i < top.items.length; i += 1) {
            var user = top.items[i];
            
            if(user.userID === command_data.tagged_user.id) {
                authorConfig = user;
                authorPos = i;
                break;
            }
        }

        authorPos += 1;
        var xp = authorConfig.xp;
        var level = authorConfig.level;
        var levelXP = command_data.server_config.module_level_level_exp;
        for(var i2 = 1; i2 < authorConfig.level; i2 += 1) {
            levelXP *= command_data.server_config.module_level_level_multiplier;
        }

        let embedLevel = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile (` + authorPos + '#)',
                icon_url: avatarUrl
            },
            fields: [ 
                {
                    name: '⚡    Server Level:',
                    value: `${level} (XP: ${Math.round(xp)}/${Math.round(levelXP)})`
                }
            ],
            thumbnail: {
                url: avatarUrl
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedLevel }).catch(e => { console.log(e); });
    },
};