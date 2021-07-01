const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "tieup",
    category: "Actions",
    description: "Ties up the tagged person-",
    helpUsage: "[mention]`",
    exampleUsage: "/userTag/",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody-", "mention1")
    ],
    permissionsNeeded: [],
    nsfw: true,
    nsfw: false,
    execute(command_data) {
        let url = command_data.global_context.utils.pick_random(command_data.global_context.neko_modules.vars.get_tieup_gifs());
        let embedTieUp = {
            title: `${command_data.msg.author.tag} ties up ${command_data.tagged_user_tags}!`,
            color: 8388736,
            image: {
                url: url
            }
        }

        command_data.msg.channel.send("", { embed: embedTieUp }).catch(e => { console.log(e); });
    },
};