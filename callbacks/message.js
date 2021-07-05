module.exports = {
    hook(global_context) {
        global_context.bot.on("message", async(message) => {
            try {
                await this.process(global_context, message);
            } catch(e) {
                global_context.modules.Sentry.captureException(e);
                global_context.logger.error("An exception occured and has been reported to Sentry");
            }
            
            global_context.data.total_events += 1;
            global_context.data.processed_events += 1;
            global_context.data.total_messages += 1;
            global_context.data.processed_messages += 1;
        });
    },

    async process(global_context, message) {
        if(message.channel.type === "dm" || message.author.bot === true) {
            return;
        }
        // TODO: deal with this in other way, because there's shouldn't be a cache for channel overwrites
        /*let can_send_messages = message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES");
        if(can_send_messages === false) {
            return;
        }*/

        let tagged = message.mentions.members.array().length > 0;
        // TODO: add support for tagging users with IDs
        let command_data = {
            global_context: global_context,
            msg: message,

            args: [],
            total_argument: "",

            tagged_users: tagged ? message.mentions.users.array() : [message.author],
            tagged_user: tagged ? message.mentions.users.array()[0] : message.author,

            tagged_members: tagged ? message.mentions.members.array() : [message.member],
            tagged_member: tagged ? message.mentions.members.array()[0] : message.member,

            server_config: await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_message", id: message.guild.id }),
            server_bans: [],
            server_mutes: [],
            server_warns: [],

            author_user_config: {},
            author_server_user_config: await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverUser", serverID: message.guild.id, userID: message.member.user.id }),
        
            tagged_user_config: {},
            tagged_server_user_config: {}
        }
        command_data.tagged_server_user_config = command_data.author_server_user_config;

        global_context.data.total_events += 1;
        global_context.data.processed_events += 1;

        let manages_guild = false;
        if(command_data.server_config.bannedWords.length > 0 || command_data.server_config.invites == false) {
            await global_context.utils.verify_guild_roles(message.guild);
            manages_guild = message.member.hasPermission("MANAGE_GUILD");
        }

        let is_banned = false;
        if(command_data.server_config.bannedWords.length > 0) {
            command_data.server_config.bannedWords.forEach(banned_word => {
                if(message.content.toLowerCase().includes(banned_word.toLowerCase()) === true && manages_guild === false) {
                    message.reply("That word isn't allowed on here-");
                    message.delete().catch(e => { global_context.logger.error(e); });
                    is_banned = true;
                }
            });
        }
        if(is_banned === true) {
            return;
        }

        let is_invite = false;
        if(command_data.server_config.invites == false) {
            if((message.content.toLowerCase().includes("discord.gg") === true || message.content.toLowerCase().includes("discordapp.com/invite") === true || message.content.toLowerCase().includes("discord.com/invite") === true) && manages_guild === false) {
                message.reply("Sending invites isn't allowed on here-");
                message.delete().catch(e => { global_context.logger.error(e); });
                is_invite = true;
            }
        }
        if(is_invite === true) {
            return;
        }

        /*let log_messages = true;
        if(log_messages === true) {
            var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, message.guild.id);

            var log = { guildID: message.guild.id, type: "message", messageID: message.id, userID: message.author.id, tag: message.author.tag, content: message.content.split("\n").join("<br>"), time: Date.now() }
            serverLogs.logs.push(log);
            bot.ssm.server_edit.edit_server_logs_in_structure(bot.ssm, message.guild, serverLogs);
        }*/

        //Check marriage proposals
        //global_context.neko_modules.mm.checkMarriageProposals(global_context, message);

        //Update user's server level
        //global_context.neko_modules.lvl.updateServerLevel(command_data, command_data.server_config.module_level_message_exp);

        let bot_id = global_context.bot.user.id;
        if(message.content === `<@!${bot_id}>`) {
            message.channel.send(`Prefix on this server is \`${command_data.server_config.prefix}\`-`).catch(e => { global_context.logger.error(e); });
            return;
        }

        if(message.content.toLowerCase() === `thanks <@!${bot_id}>` || message.content.toLowerCase() === "thanks nekomaid"  || message.content.toLowerCase() === "thanks neko") {
            let responses = [
                "You're welcome~ I guess- >~<",
                "W-What did I do?~",
                "No problem~ >//<",
                "You're welcome~ TwT",
            ]
            let response = global_context.utils.pick_random(responses);

            message.channel.send(response).catch(e => { global_context.logger.error(e); });
            return;
        }

        if(!message.content.toLowerCase().startsWith(command_data.server_config.prefix.toLowerCase())) {
            return;
        }

        let transaction = command_data.global_context.modules.Sentry.startTransaction({ op: "execute_command", name: "[Command] Unknown" });
        command_data.global_context.modules.Sentry.configureScope(scope => { scope.setSpan(transaction); });
        command_data.global_context.modules.Sentry.setUser({ id: message.author.id, username: message.author.username });
        let transaction_prepare = transaction.startChild({ op: "prepare_command" });

        command_data.args = message.content.slice(command_data.server_config.prefix.length).split(' ');
        command_data.server_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server", id: message.guild.id });
        command_data.server_bans = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverBans", id: message.guild.id });
        command_data.server_mutes = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_mutes", id: message.guild.id });
        command_data.server_warns = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "server_warnings", id: message.guild.id });
        command_data.author_config = await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: message.author.id });
        command_data.tagged_server_user_config = message.mentions.users.array().length < 1 ? command_data.author_server_user_config : await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "serverUser", serverID: message.guild.id, userID: message.mentions.users.array()[0].id });
        command_data.tagged_user_config = message.mentions.users.array().length < 1 ? command_data.author_config : await global_context.neko_modules_clients.ssm.server_fetch.fetch(global_context, { type: "global_user", id: message.mentions.users.array()[0].id });    
        
        let command_name = command_data.args.shift().toLowerCase();
        command_data.total_argument = command_data.args.join(" ");
        if(global_context.command_aliases.has(command_name) === true) {
            command_name = global_context.command_aliases.get(command_name);
        }
        if(!global_context.commands.has(command_name)) {
            return;
        }

        transaction.setName(`[Command] ${command_name}`);
        global_context.data.total_commands += 1;
        global_context.data.processed_commands += 1;

        //global_context.neko_modules.lvl.updateGlobalLevel(command_data);

        global_context.logger.log(`[${message.guild.name}] Called command: ${command_name}`);
        let command = global_context.commands.get(command_name);
        let passed = true;
        await global_context.utils.verify_guild_roles(message.guild);
        await global_context.utils.verify_guild_channels(message.guild);
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
        command.argumentsRecommended.forEach(arg => {
            if(passed === true && arg.passes(command_data, command) === false) {
                passed = false;
            }
        });
        if(command.nsfw === true && message.channel.nsfw === false) {
            message.reply("Cannot use this command in SFW channel-");
            passed = false;
        }
        if(passed === false) {
            return;
        }

        let tagged_user_tags = "";
        message.mentions.users.array().forEach((user, index) => {
            tagged_user_tags += user.tag;
            if(message.mentions.users.array().length - 1 > index) {
                tagged_user_tags += ", ";
            }
        });
        command_data.tagged_user_tags = tagged_user_tags;

        transaction_prepare.finish();
        let transaction_process = transaction.startChild({ op: "process_command" });
        await command.execute(command_data);

        transaction_process.finish();
        transaction.finish();
        command_data.global_context.modules.Sentry.configureScope(scope => { scope.setUser(null); });
    }
}