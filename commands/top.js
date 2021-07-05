const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "top",
    category: "Profile",
    description: "Displays the richest people from all servers (or current one if you type `-server` after the command).",
    helpUsage: "[?property] [?-server]` *(all arguments optional)*",
    exampleUsage: "credits -server",
    hidden: false,
    aliases: ["leaderboard", "lb"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a property.", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        let prop = "credits"
        if(command_data.args.length > 0) {
            if(command_data.args[0] != "-server") {
                prop = command_data.args[0];
            }
        }

        let props = [ prop ];
        let top_text = prop;
        let top_user_text = prop;

        switch(prop) {
            case "credits":
                props = [ "credits", "bank" ]
                top_text = "💵 Credits"
                top_user_text = "$"
                break;

            case "bank":
                top_text = "🏦 Bank"
                top_user_text = "credits"
                break;

            case "rep":
            case "reputation":
                props = [ "rep" ]
                top_text = "🎖️ Reputation"
                top_user_text = "reputation"
                break;

            case "lvl":
            case "level":
                props = [ "level" ]
                top_text = "⚡ Level"
                top_user_text = "level"
                break;

            case "votes":
                top_text = "📮 Votes"
                top_user_text = "votes"
                break;
            
            default:
                command_data.msg.reply(`Property \`${prop}\` not found-`)
                return;
        }

        let items = []
        var top_text_2 = ""
        if(command_data.args.includes("-server") === true) {
            top_text_2 = `in \`${command_data.msg.guild.name}\``
            items = await command_data.global_context.neko_modules_clients.sb.get_top_server(command_data.global_context, command_data.msg.guild, props, command_data.global_context.bot_config);
        } else {
            items = await command_data.global_context.neko_modules_clients.sb.get_top(command_data.global_context, props);
        }

        let embedTop = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle(`❯    Top - \`${top_text}\` ${top_text_2}`);
        
        let author_pos = -1;
        let author_config = -1;
        for(let i = 0; i < items.length; i += 1) {
            let user = items[i];
            if(user.userID === command_data.msg.author.id) {
                author_pos = i;
                author_config = user;
                break;
            }
        }

        let limit = items.length < 10 ? items.length : 10;
        for(let i = 0; i < limit; i += 1) {
            let user_config = items[i];
            let net = 0;
            if(i === 8 && authorPos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if(i === 9 && author_pos > 10) {
                user_config = author_config;
                i = author_pos;
            }

            props.forEach(prop => {
                net += user_config[prop];
            });

            let target_user = await command_data.global_context.bot.users.fetch(user_config.userID).catch(e => { console.log(e); });
            embedTop.addField(`${(i + 1)}) ${target_user.tag}`, `${net} ${top_user_text}`);
        }
        
        command_data.msg.channel.send("", { embed: embedTop }).catch(e => { console.log(e); });
    }
};