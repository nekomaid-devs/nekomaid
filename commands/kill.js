const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "kill",
    category: "Actions",
    description: "Kills the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        var isAllowed = true;
        command_data.tagged_users.forEach(function(user) {
            if(user.id === data.authorUser.id) {
                isAllowed = false;
            }
        });

        if(isAllowed === false) {
            command_data.msg.reply(`Let's not do that ;-;`);
            return;
        }

        //Get random gif
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getKillGifs())

        //Construct embed
        let embedKill = {
            title: `${command_data.msg.author.tag} kills ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        //Send message
        command_data.msg.channel.send("", { embed: embedKill }).catch(e => { console.log(e); });
    },
};