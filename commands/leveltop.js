module.exports = {
    name: "leveltop",
    category: "Leveling",
    description: "Displays people with highest level from this server.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply("Leveling isn't enabled on this server. (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }
        
        let top_text = "⚡ Server Level";
        let items = await command_data.global_context.neko_modules_clients.sb.get_top_server_level(command_data.global_context, command_data.server_config, command_data.msg.guild);
        let embedTop = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle(`❯    Top - \`${top_text}\``);

        let author_pos = -1;
        let author_config = -1;
        for(let i = 0; i < items.length; i += 1) {
            let user = items[i];
            if(user.user_ID === command_data.msg.author.id) {
                author_pos = i;
                author_config = user;
                break;
            }
        }

        let limit = items.length < 10 ? items.length : 10;
        for(let i = 0; i < limit; i += 1) {
            let user_config = items[i];
            let net = user_config.level;
            if(i === 8 && authorPos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if(i === 9 && author_pos > 10) {
                user_config = author_config;
                i = author_pos;
            }

            let net_2 = (user_config.xp / command_data.global_context.utils.get_level_XP(command_data.server_config, user_config)) * 100;
            let target_user = await command_data.global_context.bot.users.fetch(user_config.user_ID).catch(e => { command_data.global_context.logger.api_error(e); });
            embedTop.addField(`${(i + 1)}) ${target_user.tag}`, `Level ${net} (${Math.round(net_2)} %)`);
        }
        
        command_data.msg.channel.send("", { embed: embedTop }).catch(e => { command_data.global_context.logger.api_error(e); });
    }
};