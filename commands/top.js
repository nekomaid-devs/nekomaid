module.exports = {
    name: "top",
    category: "Profile",
    description: "Displays the richest people from all servers (or current one if you type `-server` after the command)-",
    helpUsage: "[?property] [?-server]` *(all arguments optional)*",
    exampleUsage: "credits -server",
    hidden: false,
    aliases: ["leaderboard", "lb"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        //command_data.msg.reply("This command is temporarily disabled-");
        //return;
        //Get compared property and it's custom texts
        var prop = "credits"
        if(command_data.args.length > 0) {
            if(command_data.args[0] != "-server") {
                prop = command_data.args[0];
            }
        }

        var props = [ prop ];
        var topText = prop;
        var topUserText = prop;

        switch(prop) {
            case "credits":
                props = [ "credits", "bank" ]
                topText = "💵 Credits"
                topUserText = "$"
                break;

            case "bank":
                topText = "🏦 Bank"
                topUserText = "credits"
                break;

            case "rep":
            case "reputation":
                props = [ "rep" ]
                topText = "🎖️ Reputation"
                topUserText = "reputation"
                break;

            case "lvl":
            case "level":
                props = [ "level" ]
                topText = "⚡ Level"
                topUserText = "level"
                break;

            case "votes":
                topText = "📮 Votes"
                topUserText = "votes"
                break;
            
            default:
                command_data.msg.reply("Property `" + prop + "` not found-")
                return;
        }

        //Update top users
        var top = {}
        var topText2 = ""
        if(command_data.args.includes("-server") === true) {
            topText2 = " in `" + command_data.msg.guild.name + "`"
            top = await data.bot.sb.updateTopServer(data.bot, command_data.msg.guild, props, command_data.global_context.bot_config);
        } else {
            top = await data.bot.sb.updateTop(data.bot, props);
        }

        //Construst embed
        const embedTop = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle('❯    Top - `' + topText + '`' + topText2)
        .setFooter(`Update took ${top.elapsed}s...`);

        //Get what position target user is
        var authorPos = -1;
        var authorConfig = -1;
        for(var i = 0; i < top.items.length; i += 1) {
            var user = top.items[i];
            
            if(user.userID === command_data.msg.member.id) {
                authorPos = i;
                authorConfig = user;
                break;
            }
        }
        
        //Collect top users from globalUserTop
        var limit = top.items.length < 10 ? top.items.length : 10;
        for(let i = 0; i < limit; i += 1) {
            let userConfig = top.items[i];
            let net = 0;

            if(i === 8 && authorPos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if(i === 9 && authorPos > 10) {
                userConfig = authorConfig;
                i = authorPos;
            }

            props.forEach(function(prop) {
                net += userConfig[prop];
            });

            //Get targetUser
            var targetUser = await data.bot.users.fetch(userConfig.userID).catch(e => { console.log(e); });
            var targetUserDisplayName = "<unknown>";

            if(targetUser !== undefined) {
                targetUserDisplayName = targetUser.username/* + "#" + targetUser.discriminator*/;
            }

            //Add user into ranking
            var pos = i + 1;
            embedTop.addField(pos + ") " + targetUserDisplayName, net + " " + topUserText);
        }
        
        //Send message
        command_data.msg.channel.send("", { embed: embedTop }).catch(e => { console.log(e); });
    }
};