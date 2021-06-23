module.exports = {
    name: 'leveltop',
    category: 'Leveling',
    description: 'Displays people with highest level from this server-',
    helpUsage: "`",
    hidden: false,
    aliases: [],
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
 
        //Get compared property and it's custom texts
        var topText = "⚡ Server Level"

        //Update top users
        var top = await data.bot.sb.updateTopServerLevel(data.bot, data.serverConfig, data.guild);

        //Construst embed
        const embedTop = new data.bot.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle('❯    Top - `' + topText + '`')
        .setFooter(`Update took ${top.elapsed}s...`);

        //Get what position target user is
        var authorPos = -1;
        var authorConfig = -1;
        for(var i = 0; i < top.items.length; i += 1) {
            var user = top.items[i];
            
            if(user.userID === data.authorUser.id) {
                authorPos = i;
                authorConfig = user;
                break;
            }
        }
        
        //Collect top users from globalUserTop
        var limit = top.items.length < 10 ? top.items.length : 10;
        for(let i = 0; i < limit; i += 1) {
            let userConfig = top.items[i];

            if(i === 8 && authorPos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if(i === 9 && authorPos > 10) {
                userConfig = authorConfig;
                i = authorPos;
            }

            const net = userConfig.level;

            var levelXP = data.serverConfig.module_level_level_exp;
            for(var i2 = 1; i2 < userConfig.level; i2 += 1) {
                levelXP *= data.serverConfig.module_level_level_multiplier;
            }

            const net2 = (userConfig.xp / levelXP) * 100;

            //Get targetUser
            var targetUser = await data.bot.users.fetch(userConfig.userID).catch(e => { console.log(e); });
            var targetUserDisplayName = targetUser !== undefined ? targetUser.username + "#" + targetUser.discriminator : "<unknown>";

            //Add user into ranking
            var pos = i + 1;
            embedTop.addField(pos + ") " + targetUserDisplayName, "Level " + net + " (" + Math.round(net2) + " %)");
        }
        
        //Send message
        data.channel.send("", { embed: embedTop }).catch(e => { console.log(e); });
    }
};