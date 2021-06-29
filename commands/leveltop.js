module.exports = {
    name: "leveltop",
    category: "Leveling",
    description: "Displays people with highest level from this server-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply("Leveling isn't enabled on this server- (see `" + command_data.server_config.prefix + "leveling` for help)");
            return;
        }

        let top_text = "⚡ Server Level"
        let top = await command_data.bot.sb.updateTopServerLevel(command_data.bot, command_data.server_config, command_data.msg.guild);
        let embedTop = new command_data.global_context.modules.Discord.MessageEmbed()
        .setColor(8388736)
        .setTitle(`❯    Top - \`${top_text}\``)
        .setFooter(`Update took ${top.elapsed}s...`);

        let author_pos = -1;
        let author_config = -1;
        for(let i = 0; i < top.items.length; i += 1) {
            let user = top.items[i];
            if(user.userID === command_data.msg.author.id) {
                author_pos = i;
                author_config = user;
                break;
            }
        }

        let limit = top.items.length < 10 ? top.items.length : 10;
        for(let i = 0; i < limit; i += 1) {
            let user_config = top.items[i];
            let net = user_config.level;
            if(i === 8 && authorPos > 10) {
                embedTop.addField("...", "...");
                continue;
            } else if(i === 9 && author_pos > 10) {
                user_config = author_config;
                i = author_pos;
            }

            let level_XP = command_data.server_config.module_level_level_exp;
            for(let i_2 = 1; i_2 < userConfig.level; i_2 += 1) {
                level_XP *= command_data.server_config.module_level_level_multiplier;
            }
            let net_2 = (user_config.xp / level_XP) * 100;

            let target_user = await command_data.bot.users.fetch(user_config.userID).catch(e => { console.log(e); });
            embedTop.addField(`${(i + 1)}) ${target_user.tag}`, `Level ${net} (${Math.round(net_2)} %)`);
        }
        
        command_data.msg.channel.send("", { embed: embedTop }).catch(e => { console.log(e); });
    }
};