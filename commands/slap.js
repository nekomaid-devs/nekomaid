const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "slap",
    category: "Actions",
    description: "Slaps the tagged person.",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need mention somebody.", "mention")
    ],
    argumentsRecommended: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_slap_gifs())
        let embedSlap = {
            title: `${command_data.msg.author.tag} slaps ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedSlap }).catch(e => { console.log(e); });
    },
};