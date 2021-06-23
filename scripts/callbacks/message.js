module.exports = {
    hook(bot) {
        bot.on("message", function(msg) {
            //Process the message
            try {
                bot.processMessage(bot, msg);
                
                bot.totalEvents += 1;
                bot.processedEvents += 1;
                bot.totalMessages += 1;
                bot.processedMessages += 1;
            } catch(e) {
                bot.onError(msg.channel, e);
            }
        });
    },

    async processMessage(bot, msg) {
        //Argument & Permission check
        if(msg.guild == null || msg.member == null || msg.member.user.bot === true || bot.isDatabaseReady === false || msg.channel.type === "dm") {
            return;
        }
        let canSendMessages = msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES");
        if(canSendMessages === false) {
            return;
        }

        let managesGuild = msg.member.permissionsIn(msg.channel).has("MANAGE_GUILD");
        let tagged = msg.mentions.members.array().length > 0;
        let data = {
            bot: bot,
            msg: msg,
            guild: msg.guild,
            channel: msg.channel,
            authorUser: msg.member.user,
            authorMember: msg.member,
            authorTag: msg.member.user.tag,

            taggedUsers: tagged ? msg.mentions.users.array() : [msg.member.user],
            taggedUser: tagged ? msg.mentions.users.array()[0] : msg.member.user,
            taggedUserTag: tagged ? msg.mentions.users.array()[0].tag : msg.member.user.tag,

            taggedMembers: tagged ? msg.mentions.members.array() : [msg.member],
            taggedMember: tagged ? msg.mentions.members.array()[0] : msg.member,

            serverConfig: await bot.ssm.server_fetch.fetch(bot, { type: "server_message", id: msg.guild.id }),
            authorServerConfig: await bot.ssm.server_fetch.fetch(bot, { type: "serverUser", serverID: msg.guild.id, userID: msg.member.user.id }),
            botConfig: bot.botConfig,
            
            reply: msg.reply
        }
        data.taggedServerUserConfig = data.authorServerConfig;

        bot.totalEvents += 1;
        bot.processedEvents += 1;
    
        //Get server config
        let prefix = data.serverConfig.prefix;

        let isBanned = false;
        if(data.serverConfig.bannedWords.length > 0) {
            data.serverConfig.bannedWords.forEach(bannedWord => {
                if(msg.content.toLowerCase().includes(bannedWord.toLowerCase()) === true && managesGuild === false) {
                    msg.reply("That word isn't allowed on here-");
                    msg.delete().catch(e => { console.log(e); });
                    isBanned = true;
                }
            });
        }

        if(isBanned === true) {
            return;
        }

        let isInvite = false;
        if(data.serverConfig.invites === false) {
            if((msg.content.toLowerCase().includes("discord.gg") === true || msg.content.toLowerCase().includes("discordapp.com/invite") === true || msg.content.toLowerCase().includes("discord.com/invite") === true) && managesGuild === false) {
                msg.reply("Sending invites isn't allowed on here-");
                msg.delete().catch(e => { console.log(e); });
                isInvite = true;
            }
        }

        if(isInvite === true) {
            return;
        }

        let logMesssages = true;
        if(logMesssages === true) {
            /*var serverLogs = await bot.ssm.server_fetch.fetchServerLogs(bot, msg.guild.id);

            var log = { guildID: msg.guild.id, type: "message", messageID: msg.id, userID: msg.author.id, tag: msg.author.tag, content: msg.content.split("\n").join("<br>"), time: Date.now() }
            serverLogs.logs.push(log);
            bot.ssm.server_edit.editServerLogsInStructure(bot.ssm, msg.guild, serverLogs);*/
        }

        //Check marriage proposals
        bot.mm.checkMarriageProposals(bot, msg);

        //Update user's server level
        bot.lvl.updateServerLevel(data, data.serverConfig.module_level_message_exp);

        if(msg.content === "<@!691398095841263678>") {
            msg.channel.send("Prefix on this server is `" + prefix + "`-").catch(e => { console.log(e); });
            return;
        }

        if(msg.content.toLowerCase() === "thanks <@!691398095841263678>" || msg.content.toLowerCase() === "thanks nekomaid"  || msg.content.toLowerCase() === "thanks neko") {
            let responses = [
                "You're welcome~ I guess- >~<",
                "W-What did I do?~",
                "No problem~ >//<",
                "You're welcome~ TwT",
            ]
            let response = data.bot.pickRandom(responses);

            msg.channel.send(response).catch(e => { console.log(e); });
            return;
        }
    
        //Check prefix
        if(!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            return;
        }

        //Get user's config
        data.args = msg.content.slice(prefix.length).split(' ');
        data.serverConfig = await bot.ssm.server_fetch.fetch(bot, { type: "server", id: msg.guild.id });
        data.serverBans = await bot.ssm.server_fetch.fetch(bot, { type: "serverBans", id: msg.guild.id });
        data.serverMutes = await bot.ssm.server_fetch.fetch(bot, { type: "serverMutes", id: msg.guild.id });
        data.serverWarns = await bot.ssm.server_fetch.fetch(bot, { type: "serverWarnings", id: msg.guild.id });
        data.authorConfig = await bot.ssm.server_fetch.fetch(bot, { type: "globalUser", id: msg.author.id });
        data.taggedServerUserConfig = msg.mentions.users.array().length < 1 ? data.authorServerConfig : await bot.ssm.server_fetch.fetch(bot, { type: "serverUser", serverID: msg.guild.id, userID: msg.mentions.users.array()[0].id });
        data.taggedUserConfig = msg.mentions.users.array().length < 1 ? data.authorConfig : await bot.ssm.server_fetch.fetch(bot, { type: "globalUser", id: msg.mentions.users.array()[0].id });    
        
        //Process message
        let commandName = data.args.shift().toLowerCase();
        data.totalArgument = data.args.join(" ");
    
        //Translate alias
        if(bot.aliases.has(commandName) === true) {
            commandName = bot.aliases.get(commandName);
        }

        //Check if command exists
        if(!bot.commands.has(commandName)) {
            return;
        }
    
        //Add to command counter
        bot.totalCommands += 1;
        bot.processedCommands += 1;

        //Update user's global level
        bot.lvl.updateGlobalLevel(data);

        console.log(`- [${msg.guild.name}] Called command: ${commandName}`);
        let command = bot.commands.get(commandName);
        let passed = true;
        command.permissionsNeeded.forEach(perm => {
            if(passed === true && perm.passes(data, msg) === false) {
                passed = false;
            }
        });

        command.argumentsNeeded.forEach(arg => {
            if(passed === true && arg.passes(msg, data.args, command, prefix) === false) {
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

        let taggedUserTags = "";
        msg.mentions.users.array().forEach(function(user, index) {
            taggedUserTags += user.username + "#" + user.discriminator;
            if(msg.mentions.users.array().length - 1 > index) {
                taggedUserTags += ", ";
            }
        });
        data.taggedUserTags = taggedUserTags;

        try {
            command.execute(data);
        } catch (e) {
            bot.onError(msg.channel, e);
        }
    
        console.log(">");
    }
}