const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "kill",
    category: "Actions",
    description: "Kills the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody.", "mention")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    cooldown: 1500,
    execute(command_data) {
        let is_self = command_data.tagged_users.some(e => { return e.id === command_data.msg.author.id; });
        if(is_self === true) {
            command_data.msg.reply("Let's not do that ;-;");
            return;
        }

        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_kill_gifs());
        let embedKill = {
            title: `${command_data.msg.author.tag} kills ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedKill }).catch(e => { command_data.global_context.logger.api_error(e); });
    },
};