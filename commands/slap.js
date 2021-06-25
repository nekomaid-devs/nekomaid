const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "slap",
    category: "Actions",
    description: "Slaps the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.getSlapGifs())
        let embedSlap = {
            title: `${command_data.msg.author.tag} slaps ${data.bot.taggedUserTags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }
        
        command_data.msg.channel.send("", { embed: embedSlap }).catch(e => { console.log(e); });
    },
};