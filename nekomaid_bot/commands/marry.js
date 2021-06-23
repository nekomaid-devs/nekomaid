module.exports = {
    name: 'marry',
    category: 'Profile',
    description: 'Marries the tagged person-',
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        //Argument & Permission check
        if(data.authorUser.id === data.taggedUser.id) {
            data.reply(`You can't marry yourself silly-`);
            return;
        }

        //Checks for extra arguments
        var forceMarry = false;

        if(data.args.length > 1 && data.args[1] === "-fm") {
            if(data.botConfig.botOwners.includes(data.authorUser.id) === false) {
                data.reply("You aren't the bot owner-");
                return;
            }

            forceMarry = true;
        }

        //Check author's and user's configs
        if(data.authorConfig.marriedID != "-1") {
            data.reply(`You need to divorce first-`);
            return;
        }

        if(data.taggedUserConfig.marriedID != "-1") {
            data.reply(`This user is already married-`);
            return;
        }

        //Send the marriage proposal
        if(forceMarry === true) {
            data.bot.mm.addMarriageProposal(data.bot, data.channel, data.authorUser, data.taggedUser, 0);
            data.bot.mm.acceptMarryProposal(data.bot, data.msg, data.authorUser, data.taggedUser, 2);
        } else {
            data.bot.mm.addMarriageProposal(data.bot, data.channel, data.authorUser, data.taggedUser);
        }
    },
};