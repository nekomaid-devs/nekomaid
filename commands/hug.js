const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "hug",
    category: "Actions",
    description: "Hugs the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_hug_gifs())
        let embedHug = {
            title: `${command_data.msg.author.tag} hugs ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedHug }).catch(e => { console.log(e); });
    },
};