module.exports = {
    hook(global_context) {
        global_context.bot.on("message", async(msg) => {
            this.process_message(global_context, msg);
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
            global_context.data.total_messages += 1;
            global_context.data.processed_messages += 1;
        });
    },

    async process_message(global_context, msg) {
        //Argument & Permission check
        if(msg.channel.type === "dm" || msg.author.bot === true) {
            return;
        }
        let can_send_messages = msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES");
        if(can_send_messages === false) {
            return;
        }

        let manages_guild = msg.member.permissionsIn(msg.channel).has("MANAGE_GUILD");
        let tagged = msg.mentions.members.array().length > 0;
        let command_data = {
            global_context: global_context,
            msg: msg,

            args: [],
            total_argument: "",

            tagged_users: tagged ? msg.mentions.users.array() : [msg.author],
            tagged_user: tagged ? msg.mentions.users.array()[0] : msg.author,

            tagged_members: tagged ? msg.mentions.members.array() : [msg.member],
            tagged_member: tagged ? msg.mentions.members.array()[0] : msg.member,

            server_config: await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_message", id: msg.guild.id }),
            server_bans: [],
            server_mutes: [],
            server_warns: [],

            author_user_config: {},
            author_server_user_config: await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverUser", serverID: msg.guild.id, userID: msg.member.user.id }),
        
            tagged_user_config: {},
            tagged_server_user_config: {}
        }
        command_data.tagged_server_user_config = command_data.author_server_user_config;

        global_context.data.total_events += 1;
        global_context.data.processed_events += 1;

        let is_banned = false;
        if(command_data.server_config.bannedWords.length > 0) {
            command_data.server_config.bannedWords.forEach(banned_word => {
                if(msg.content.toLowerCase().includes(banned_word.toLowerCase()) === true && manages_guild === false) {
                    msg.reply("That word isn't allowed on here-");
                    msg.delete().catch(e => { global_context.logger.error(e); });
                    is_banned = true;
                }
            });
        }
        if(is_banned === true) {
            return;
        }

        let is_invite = false;
        if(command_data.server_config.invites === false) {
            if((msg.content.toLowerCase().includes("discord.gg") === true || msg.content.toLowerCase().includes("discordapp.com/invite") === true || msg.content.toLowerCase().includes("discord.com/invite") === true) && manages_guild === false) {
                msg.reply("Sending invites isn't allowed on here-");
                msg.delete().catch(e => { global_context.logger.error(e); });
                is_invite = true;
            }
        }
        if(is_invite === true) {
            return;
        }

        /*let log_messages = true;
        if(log_messages === true) {
            var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, msg.guild.id);

            var log = { guildID: msg.guild.id, type: "message", messageID: msg.id, userID: msg.author.id, tag: msg.author.tag, content: msg.content.split("\n").join("<br>"), time: Date.now() }
            serverLogs.logs.push(log);
            bot.ssm.server_edit.editServerLogsInStructure(bot.ssm, msg.guild, serverLogs);
        }*/

        //Check marriage proposals
        //global_context.neko_modules.mm.checkMarriageProposals(global_context, msg);

        //Update user's server level
        //global_context.neko_modules.lvl.updateServerLevel(command_data, command_data.server_config.module_level_message_exp);

        let bot_id = global_context.bot.user.id;
        if(msg.content === `<@!${bot_id}>`) {
            msg.channel.send(`Prefix on this server is \`${command_data.server_config.prefix}\`-`).catch(e => { global_context.logger.error(e); });
            return;
        }

        if(msg.content.toLowerCase() === `thanks <@!${bot_id}>` || msg.content.toLowerCase() === "thanks nekomaid"  || msg.content.toLowerCase() === "thanks neko") {
            let responses = [
                "You're welcome~ I guess- >~<",
                "W-What did I do?~",
                "No problem~ >//<",
                "You're welcome~ TwT",
            ]
            let response = global_context.utils.pick_random(responses);

            msg.channel.send(response).catch(e => { global_context.logger.error(e); });
            return;
        }
    
        //Check prefix
        if(!msg.content.toLowerCase().startsWith(command_data.server_config.prefix.toLowerCase())) {
            return;
        }

        //Get user's config
        command_data.args = msg.content.slice(command_data.server_config.prefix.length).split(' ');
        command_data.server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server", id: msg.guild.id });
        command_data.server_bans = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverBans", id: msg.guild.id });
        command_data.server_mutes = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverMutes", id: msg.guild.id });
        command_data.server_warns = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverWarnings", id: msg.guild.id });
        command_data.author_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "globalUser", id: msg.author.id });
        command_data.tagged_server_user_config = msg.mentions.users.array().length < 1 ? command_data.author_server_user_config : await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverUser", serverID: msg.guild.id, userID: msg.mentions.users.array()[0].id });
        command_data.tagged_user_config = msg.mentions.users.array().length < 1 ? command_data.msg.author_config : await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "globalUser", id: msg.mentions.users.array()[0].id });    
        
        //Process message
        let command_name = command_data.args.shift().toLowerCase();
        command_data.total_argument = command_data.args.join(" ");
    
        //Translate alias
        if(global_context.command_aliases.has(command_name) === true) {
            command_name = global_context.command_aliases.get(command_name);
        }

        //Check if command exists
        if(!global_context.commands.has(command_name)) {
            return;
        }
    
        //Add to command counter
        global_context.data.total_commands += 1;
        global_context.data.processed_commands += 1;

        //Update user's global level
        //global_context.neko_modules.lvl.updateGlobalLevel(command_data);

        global_context.logger.log(`[${msg.guild.name}] Called command: ${command_name}`);
        let command = global_context.commands.get(command_name);
        let passed = true;
        command.permissionsNeeded.forEach(perm => {
            if(passed === true && perm.passes(command_data, command) === false) {
                passed = false;
            }
        });
        command.argumentsNeeded.forEach(arg => {
            if(passed === true && arg.passes(command_data, command) === false) {
                passed = false;
            }
        });
        if(command.nsfw === true && msg.channel.nsfw === false) {
            msg.reply("Cannot use this command in SFW channel-");
            passed = false;
        }
        if(passed === false) {
            return;
        }

        let tagged_user_tags = "";
        msg.mentions.users.array().forEach((user, index) => {
            tagged_user_tags += user.tag;
            if(msg.mentions.users.array().length - 1 > index) {
                tagged_user_tags += ", ";
            }
        });
        command_data.tagged_user_tags = tagged_user_tags;

        command.execute(command_data);
    }
}