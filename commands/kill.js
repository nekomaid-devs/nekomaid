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
        let is_allowed = true;
        command_data.tagged_users.forEach(user => {
            if(user.id === command_data.msg.author.id) {
                is_allowed = false;
            }
        });

        if(is_allowed === false) {
            command_data.msg.reply("Let's not do that ;-;");
            return;
        }

        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getKillGifs());
        let embedKill = {
            title: `${command_data.msg.author.tag} kills ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedKill }).catch(e => { console.log(e); });
    },
};