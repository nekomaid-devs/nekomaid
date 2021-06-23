module.exports = {
    name: 'level',
    category: 'Leveling',
    description: "Displays the tagged user's server profile-",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: ["lvl"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Argument check
        if(data.serverConfig.module_level_enabled == false) {
            data.reply("Leveling isn't enabled on this server- (see `" + data.serverConfig.prefix + "leveling` for help)");
            return;
        }

        //Construct embed
        var avatarUrl = data.taggedUser.avatarURL({ format: 'png', dynamic: true, size: 1024 });

        //Update top users
        var top = await data.bot.sb.updateTopServerLevel(data.bot, data.serverConfig, data.guild);

        //Get what position target user is
        var authorPos = -1;
        var authorConfig = -1;
        for(var i = 0; i < top.items.length; i += 1) {
            var user = top.items[i];
            
            if(user.userID === data.taggedUser.id) {
                authorConfig = user;
                authorPos = i;
                break;
            }
        }

        authorPos += 1;
        var xp = authorConfig.xp;
        var level = authorConfig.level;
        var levelXP = data.serverConfig.module_level_level_exp;
        for(var i2 = 1; i2 < authorConfig.level; i2 += 1) {
            levelXP *= data.serverConfig.module_level_level_multiplier;
        }

        var embedLevel = {
            color: 8388736,
            author: {
                name: `${data.taggedUserTag}'s Profile (` + authorPos + '#)',
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
                text: `Requested by ${data.authorTag}`
            },
        }

        //Send message
        data.channel.send("", { embed: embedLevel }).catch(e => { console.log(e); });
    },
};