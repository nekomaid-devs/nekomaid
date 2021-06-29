module.exports = {
    name: "divorce",
    category: "Profile",
    description: "Divorces married user-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.msg.mentions.users.array().length > 0) {
            if(command_data.global_context.bot_config.botOwners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply(`You aren't the bot owner- (use \`${command_data.server_config.prefix}divorce\` if you want to divorce)`);
                return;
            }
            if(command_data.tagged_user_config.marriedID === "-1") {
                command_data.msg.reply("This user isn't married-");
                return;
            }

            let married_user = await command_data.bot.users.fetch(command_data.tagged_user_config.marriedID).catch(e => { console.log(e); });
            if(married_user === undefined) {
                command_data.msg.reply("There was an error in fetching User-");
            } else {
                let tagged_user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "globalUser", id: command_data.tagged_user.id });    
                let user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "globalUser", id: marriedUser0.id });    

                tagged_user_config.marriedID = "-1";
                tagged_user_config.canDivorce = true;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: taggedUserConfig });

                user_config.marriedID = "-1";
                user_config.canDivorce = true;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: marriedUser0.id, user: globalUserConfig0 });

                command_data.msg.channel.send(`Force divorced \`${command_data.tagged_user.tag}\` and \`${married_user.tag}\`!`).catch(e => { console.log(e); });
            }

            return;
        }

        if(command_data.author_config.marriedID === "-1") {
            command_data.msg.reply("You're not married-");
            return;
        }

        let married_user = await command_data.bot.users.fetch(command_data.author_config.marriedID).catch(e => { console.log(e); });
        let user_config = -1;
        if(married_user !== undefined) {
            user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "globalUser", id: marriedUser.id });    
        }
        if(command_data.author_config.canDivorce == false) {
            command_data.msg.reply(`You can't divorce \`${married_user.tag}\`, because you're going be with them forever...`);
            return;
        }

        command_data.author_config.marriedID = "-1";
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: command_data.msg.author.id, user: command_data.author_config });

        if(user_config != -1) {
            user_config.marriedID = "-1";
            user_config.canDivorce = true;
            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context.neko_modules_clients.ssm, { type: "globalUser", id: marriedUser.id, user: globalUserConfig });
        }

        command_data.msg.channel.send(`\`${command_data.msg.author.tag}\` divorced \`${married_user.tag}\`!`).catch(e => { console.log(e); });
    },
};