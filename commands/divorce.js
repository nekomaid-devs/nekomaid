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
        // TODO: re-factor command
        if(data.msg.mentions.users.array().length > 0) {
            //Permission check
            if(command_data.global_context.bot_config.botOwners.includes(data.authorUser.id) === false) {
                command_data.msg.reply("You aren't the bot owner- (use `" + command_data.server_config.prefix + "divorce` if you want to divorce)");
                return;
            }

            if(command_data.tagged_user_config.marriedID === "-1") {
                command_data.msg.reply(`This user isn't married-`);
                return;
            }

            var marriedUser0 = await data.bot.users.fetch(command_data.tagged_user_config.marriedID).catch(e => { console.log(e); });
            if(marriedUser0 === undefined) {
                command_data.msg.reply(`There was an error in fetching User-`);
            } else {
                var taggedUserConfig = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "globalUser", id: command_data.tagged_user.id });    
                var globalUserConfig0 = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "globalUser", id: marriedUser0.id });    

                //Changes the data in the structure
                taggedUserConfig.marriedID = "-1";
                taggedUserConfig.canDivorce = true;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: command_data.tagged_user.id, user: taggedUserConfig });

                //Changes the data in the structure
                globalUserConfig0.marriedID = "-1";
                globalUserConfig0.canDivorce = true;

                //Edits and broadcasts the change
                data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: marriedUser0.id, user: globalUserConfig0 });

                //Construct message and send it
                command_data.msg.channel.send("Force divorced `" + command_data.tagged_user.tag + "` and `" + marriedUser0.tag + "`!").catch(e => { console.log(e); });
            }

            return;
        }

        if(data.authorConfig.marriedID === "-1") {
            command_data.msg.reply(`You're not married-`);
            return;
        }

        //Get the married user and config
        var marriedUser = await data.bot.users.fetch(data.authorConfig.marriedID).catch(e => { console.log(e); });
        var globalUserConfig = -1;
        if(marriedUser !== undefined) {
            globalUserConfig = await data.bot.ssm.server_fetch.fetch(data.bot, { type: "globalUser", id: marriedUser.id });    
        }

        //Check if author can divorce
        if(data.authorConfig.canDivorce == false) {
            command_data.msg.reply("You can't divorce `" + marriedUser.tag + ", because you're going be with them forever...");
            return;
        }

        //Changes the data in the structure
        data.authorConfig.marriedID = "-1";

        //Edits and broadcasts the change
        data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: data.authorUser.id, user: data.authorConfig });

        if(globalUserConfig != -1) {
            globalUserConfig.marriedID = "-1";
            globalUserConfig.canDivorce = true;

            //Edits and broadcasts the change
            data.bot.ssm.server_edit.edit(data.bot.ssm, { type: "globalUser", id: marriedUser.id, user: globalUserConfig });
        }

        //Construct message and send it
        command_data.msg.channel.send("`" + command_data.msg.author.tag + "` divorced `" + marriedUser.tag + "`!").catch(e => { console.log(e); });
    },
};