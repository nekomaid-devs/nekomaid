module.exports = {
    name: "marry",
    category: "Profile",
    description: "Marries the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        //Argument & Permission check
        if(command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply(`You can't marry yourself silly-`);
            return;
        }

        //Checks for extra arguments
        var forceMarry = false;

        if(command_data.args.length > 1 && command_data.args[1] === "-fm") {
            if(command_data.global_context.bot_config.botOwners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply("You aren't the bot owner-");
                return;
            }

            forceMarry = true;
        }

        //Check author's and user's configs
        if(command_data.author_config.marriedID != "-1") {
            command_data.msg.reply(`You need to divorce first-`);
            return;
        }

        if(command_data.tagged_user_config.marriedID != "-1") {
            command_data.msg.reply(`This user is already married-`);
            return;
        }

        //Send the marriage proposal
        if(forceMarry === true) {
            data.bot.mm.addMarriageProposal(data.bot, command_data.msg.channel, command_data.msg.author, command_data.tagged_user, 0);
            data.bot.mm.acceptMarryProposal(data.bot, data.msg, command_data.msg.author, command_data.tagged_user, 2);
        } else {
            data.bot.mm.addMarriageProposal(data.bot, command_data.msg.channel, command_data.msg.author, command_data.tagged_user);
        }
    },
};