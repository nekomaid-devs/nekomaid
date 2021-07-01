module.exports = {
    name: "marry",
    category: "Profile",
    description: "Marries the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(command_data.msg.author.id === command_data.tagged_user.id) {
            command_data.msg.reply("You can't marry yourself silly-");
            return;
        }

        let force_marry = false;
        if(command_data.args.length > 1 && command_data.args[1] === "-fm") {
            if(command_data.global_context.bot_config.botOwners.includes(command_data.msg.author.id) === false) {
                command_data.msg.reply("You aren't the bot owner-");
                return;
            }

            force_marry = true;
        }

        if(command_data.author_config.marriedID != "-1") {
            command_data.msg.reply("You need to divorce first-");
            return;
        }
        if(command_data.tagged_user_config.marriedID != "-1") {
            command_data.msg.reply("This user is already married-");
            return;
        }

        if(force_marry === true) {
            command_data.global_context.neko_modules_clients.mm.addMarriageProposal(command_data.bot, command_data.msg.channel, command_data.msg.author, command_data.tagged_user, 0);
            command_data.global_context.neko_modules_clients.mm.acceptMarryProposal(command_data.bot, command_data.msg, command_data.msg.author, command_data.tagged_user, 2);
        } else {
            command_data.global_context.neko_modules_clients.mm.addMarriageProposal(command_data.bot, command_data.msg.channel, command_data.msg.author, command_data.tagged_user);
        }
    },
};