module.exports = {
    name: "divorce",
    category: "Profile",
    description: "Divorces married user.",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.msg.mentions.users.array().length > 0) {
            if(command_data.global_context.bot_config.bot_owners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply(`You aren't the bot owner- (use \`${command_data.server_config.prefix}divorce\` if you want to divorce)`);
                return;
            }
            if(command_data.tagged_user_config.married_ID === "-1") {
                command_data.msg.reply("This user isn't married-");
                return;
            }

            let married_user = await command_data.global_context.bot.users.fetch(command_data.tagged_user_config.married_ID).catch(e => { command_data.global_context.logger.api_error(e); });
            if(married_user === undefined) {
                command_data.msg.reply("There was an error in fetching User-");
            } else {
                let tagged_user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id });    
                let user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "global_user", id: married_user.id });    

                tagged_user_config.married_ID = "-1";
                tagged_user_config.can_divorce = true;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.tagged_user.id, user: tagged_user_config });

                user_config.married_ID = "-1";
                user_config.can_divorce = true;
                command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: married_user.id, user: user_config });

                command_data.msg.channel.send(`Force divorced \`${command_data.tagged_user.tag}\` and \`${married_user.tag}\`!`).catch(e => { command_data.global_context.logger.api_error(e); });
            }

            return;
        }

        if(command_data.author_config.married_ID === "-1") {
            command_data.msg.reply("You're not married-");
            return;
        }

        // TODO: this part needs to be re-done
        let married_user = await command_data.global_context.bot.users.fetch(command_data.author_config.married_ID).catch(e => { command_data.global_context.logger.api_error(e); });
        let user_config = -1;
        if(married_user !== undefined) {
            user_config = await command_data.global_context.neko_modules_clients.ssm.server_fetch.fetch(command_data.global_context, { type: "global_user", id: married_user.id });    
        }
        if(command_data.author_config.can_divorce == false) {
            command_data.msg.reply(`You can't divorce \`${married_user.tag}\`, because you're going be with them forever...`);
            return;
        }

        command_data.author_config.married_ID = "-1";
        command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: command_data.msg.author.id, user: command_data.author_config });

        if(user_config != -1) {
            user_config.married_ID = "-1";
            user_config.can_divorce = true;
            command_data.global_context.neko_modules_clients.ssm.server_edit.edit(command_data.global_context, { type: "global_user", id: married_user.id, user: user_config });
        }

        command_data.msg.channel.send(`\`${command_data.msg.author.tag}\` divorced \`${married_user.tag}\`!`).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};